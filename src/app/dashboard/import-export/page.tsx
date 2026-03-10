'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { exportProductsAction, importProductsAction } from '@/actions/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportExportPage() {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);

    const handleExport = async () => {
        if (!user) return;
        setExporting(true);
        try {
            const products = await exportProductsAction();

            if (!products?.length) { toast.error('No products to export'); setExporting(false); return; }

            // Build CSV
            const headers = ['Product Name', 'Parent SKU', 'Description', 'MRP', 'Category', 'Child SKUs (SKU|Size|Color)'];
            const rows = products.map((p: Record<string, unknown>) => {
                const childSkus = (p.child_skus as Array<{ child_sku: string; size: string | null; color: string | null }>) || [];
                const skuStr = childSkus.map((s) => `${s.child_sku}|${s.size || ''}|${s.color || ''}`).join('; ');
                return [
                    `"${(p.product_name as string || '').replace(/"/g, '""')}"`,
                    p.parent_sku,
                    `"${((p.description as string) || '').replace(/"/g, '""')}"`,
                    p.mrp || '',
                    p.category || '',
                    `"${skuStr}"`,
                ].join(',');
            });

            const csv = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SKUProvision_Export_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Exported ${products.length} products`);
        } catch {
            toast.error('Export failed');
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setImporting(true);
        setImportResult(null);
        try {
            const text = await file.text();
            const lines = text.split('\n').filter((l) => l.trim());
            if (lines.length < 2) { toast.error('CSV file is empty'); setImporting(false); return; }

            let success = 0;
            // Build products array from CSV
            const parsedProducts: any[] = [];
            for (let i = 1; i < lines.length; i++) {
                try {
                    const fields = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((f) => f.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
                    const [productName, parentSku, description, mrp, category, childSkuStr] = fields;

                    if (!productName?.trim() || !parentSku?.trim()) continue;

                    let child_skus: any[] = [];
                    if (childSkuStr?.trim()) {
                        child_skus = childSkuStr.split(';').map((s) => s.trim()).filter(Boolean).map(cs => {
                            const [sku, size, color] = cs.split('|');
                            return { child_sku: sku.trim().toUpperCase() };
                        }).filter(cs => cs.child_sku);
                    }

                    parsedProducts.push({
                        product_name: productName.trim(),
                        parent_sku: parentSku.trim().toUpperCase(),
                        description: description?.trim() || null,
                        category: category?.trim() || null,
                        child_skus
                    });
                } catch {
                    // Ignore parsing errors for individual rows
                }
            }

            const result = await importProductsAction(parsedProducts);

            setImportResult({ success: result.success, failed: result.failed });
            toast.success(`Imported ${result.success} products${result.failed ? `, ${result.failed} failed` : ''}`);
        } catch {
            toast.error('Import failed. Check your CSV format.');
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-white">Import / Export</h2>
                <p className="text-sm text-slate-500 mt-1">Bulk manage your products with CSV files.</p>
            </motion.div>

            {/* Export */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-green-400" /> Export Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-4">Download all your products and child SKUs as a CSV file.</p>
                    <Button onClick={handleExport} disabled={exporting} className="bg-green-600 hover:bg-green-500 text-white rounded-xl">
                        {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {exporting ? 'Exporting...' : 'Export to CSV'}
                    </Button>
                </CardContent>
            </Card>

            {/* Import */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-400" /> Import Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-2">Upload a CSV with this format:</p>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-4 overflow-x-auto">
                        <code className="text-xs text-slate-400 whitespace-nowrap">
                            Product Name, Parent SKU, Description, MRP, Category, &quot;ChildSKU1|Size|Color; ChildSKU2|Size|Color&quot;
                        </code>
                    </div>

                    <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleImport} className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={importing} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                        {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {importing ? 'Importing...' : 'Upload CSV'}
                    </Button>

                    {importResult && (
                        <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                            {importResult.failed === 0 ? (
                                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                            )}
                            <div className="text-sm">
                                <span className="text-green-400">{importResult.success} imported</span>
                                {importResult.failed > 0 && <span className="text-red-400 ml-2">{importResult.failed} failed</span>}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
