'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import * as xlsx from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Download, Loader2, ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BulkUploadPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        // Create Instructions sheet
        const instructionsData = [
            ["SKUProvision Bulk Upload Template Guide"],
            [""],
            ["IMPORTANT RULES:"],
            ["1. Do not change the column names in the 'Products' sheet."],
            ["2. Parent SKU is REQUIRED. This groups Child SKUs together."],
            ["3. To add multiple Child SKUs to one product, use the SAME Parent SKU on multiple rows."],
            [""],
            ["COLUMN DEFINITIONS:"],
            ["- Parent SKU (Required): The main SKU code for the product."],
            ["- Product Name (Optional): Name of the product (defaults to Parent SKU if empty)."],
            ["- Image URL (Optional): Direct link to the product image."],
            ["- Category (Optional): Product category."],
            ["- MRP (Optional): Price in INR."],
            ["- Description (Optional): Brief details about the product."],
            ["- Child SKU (Optional): Specific variation SKU (e.g., Parent-L-Red)."],
            ["- Size (Optional): Size variation."],
            ["- Color (Optional): Color variation."],
        ];

        // Create Products (Main & Optional) sheet
        const productsData = [
            ["Parent SKU", "Product Name", "Image URL", "Category", "MRP", "Description", "Child SKU", "Size", "Color"],
            ["TSHIRT-001", "Cotton T-Shirt", "https://example.com/img1.jpg", "Clothing", "499", "A comfortable cotton t-shirt", "TSHIRT-001-L", "L", "Red"],
            ["TSHIRT-001", "Cotton T-Shirt", "", "Clothing", "499", "A comfortable cotton t-shirt", "TSHIRT-001-XL", "XL", "Blue"],
            ["MUG-002", "Ceramic Mug", "", "Home", "199", "", "", "", ""]
        ];

        const wb = xlsx.utils.book_new();

        const wsInstructions = xlsx.utils.aoa_to_sheet(instructionsData);
        xlsx.utils.book_append_sheet(wb, wsInstructions, "Instructions");

        const wsProducts = xlsx.utils.aoa_to_sheet(productsData);
        xlsx.utils.book_append_sheet(wb, wsProducts, "Products");

        xlsx.writeFile(wb, "SKUProvision_Bulk_Template.xlsx");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) {
            toast.error('Please select a file first');
            return;
        }

        setLoading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = xlsx.read(data);

            let worksheet;
            // Try to find 'Products' sheet, fallback to first sheet if not found
            if (workbook.SheetNames.includes("Products")) {
                worksheet = workbook.Sheets["Products"];
            } else {
                worksheet = workbook.Sheets[workbook.SheetNames[0]];
            }

            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

            if (!jsonData || jsonData.length === 0) {
                throw new Error("No data found in the Excel file");
            }

            // Transform data to groups
            const productsMap = new Map();

            for (const row of jsonData as any[]) {
                const parentSku = row["Parent SKU"]?.toString().trim().toUpperCase();

                if (!parentSku) {
                    continue; // Skip rows without Parent SKU
                }

                if (!productsMap.has(parentSku)) {
                    productsMap.set(parentSku, {
                        sku: parentSku,
                        title: row["Product Name"]?.toString().trim() || parentSku,
                        description: row["Description"]?.toString().trim() || null,
                        category: row["Category"]?.toString().trim() || null,
                        mrp: row["MRP"] ? parseFloat(row["MRP"].toString()) : null,
                        main_image: row["Image URL"]?.toString().trim() || null,
                        childSkus: []
                    });
                }

                const childSku = row["Child SKU"]?.toString().trim().toUpperCase();
                if (childSku) {
                    productsMap.get(parentSku).childSkus.push({
                        skuCode: childSku,
                        size: row["Size"]?.toString().trim() || null,
                        color: row["Color"]?.toString().trim() || null,
                    });
                }
            }

            const finalProducts = Array.from(productsMap.values());

            if (finalProducts.length === 0) {
                throw new Error("No valid products found. Parent SKU is required.");
            }

            // Send to API
            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: finalProducts }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Failed to upload products');
            }

            const result = await res.json();

            toast.success(`Successfully added ${result.count || finalProducts.length} products!`);
            router.push('/dashboard/products');

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Something went wrong during upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products" className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-xl font-bold text-white">Bulk Upload Products</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Download Template */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">1</span>
                            Download Template
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Download our Excel template to see the required format and instructions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <ul className="text-xs text-slate-300 space-y-2">
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Parent SKU is required for all rows.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Group child SKUs by using the same Parent SKU.</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Add direct image links in the Image URL column.</li>
                            </ul>
                        </div>
                        <Button onClick={downloadTemplate} variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 h-12">
                            <Download className="w-4 h-4 mr-2" />
                            Download .xlsx Template
                        </Button>
                    </CardContent>
                </Card>

                {/* Step 2: Upload File */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">2</span>
                            Upload Data
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Upload your filled Excel file to import products in bulk.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <>
                                    <FileSpreadsheet className="w-10 h-10 text-green-400 mb-3" />
                                    <h3 className="text-sm font-medium text-white mb-1">{file.name}</h3>
                                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    <Button variant="ghost" size="sm" className="mt-4 text-slate-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                        Remove file
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-slate-500 mb-3" />
                                    <h3 className="text-sm font-medium text-white mb-1">Click to upload</h3>
                                    <p className="text-xs text-slate-400">XLSX or CSV files only</p>
                                </>
                            )}
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                            {loading ? 'Importing Products...' : 'Start Import'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
