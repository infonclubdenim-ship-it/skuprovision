'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function requireUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
}

export async function getEmployeesAction() {
    const user = await requireUser();

    const employees = await prisma.employee.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return employees.map(emp => ({
        id: emp.id,
        employee_email: emp.employeeEmail,
        employee_name: emp.employeeName,
        is_active: emp.isActive,
        created_at: emp.createdAt.toISOString()
    }));
}

export async function addEmployeeAction(employeeEmail: string, employeeName: string | null) {
    const user = await requireUser();

    // Check if employee email exists
    const existing = await prisma.employee.findFirst({
        where: { ownerId: user.id, employeeEmail }
    });

    if (existing) {
        throw new Error('Employee email already exists');
    }

    const employee = await prisma.employee.create({
        data: {
            ownerId: user.id,
            employeeEmail,
            employeeName
        }
    });

    revalidatePath('/dashboard/employees');
    return employee;
}

export async function removeEmployeeAction(id: string) {
    const user = await requireUser();

    const employee = await prisma.employee.findFirst({
        where: { id, ownerId: user.id }
    });

    if (!employee) throw new Error('Employee not found');

    await prisma.employee.delete({
        where: { id }
    });

    revalidatePath('/dashboard/employees');
}
