import { useEffect } from 'react';
import { FaTimes, FaDownload, FaPrint, FaReceipt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import type { PaymentReceiptModalProps } from '../../../../domain/types/user/financial';
import { formatDate } from '../../canvas/materials/utils/materialUtils';

export default function PaymentReceiptModal({ payment, isOpen, onClose }: PaymentReceiptModalProps) {
    const { styles, theme } = usePreferences();

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    if (!isOpen || !payment) return null;


    const formatAmount = (amount?: number) => {
        if (!amount) return '0.00';
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    const handleDownloadReceipt = () => {
        const receiptContent = `
Payment Receipt
================

Date: ${formatDate(payment.paidAt || payment.date || new Date().toISOString())}
Description: ${payment.chargeTitle || payment.description || 'N/A'}
Payment Method: ${payment.method || 'N/A'}
Amount: $${formatAmount(payment.amount)}
Payment ID: ${payment.id || 'N/A'}

Thank you for your payment!
    `.trim();

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment-receipt-${payment.id || Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Receipt downloaded successfully!');
    };

    const handlePrintReceipt = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt</title>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: #f8f9fa;
                color: #333;
              }
              .receipt { 
                background: white;
                border: 2px solid #e5e7eb; 
                border-radius: 12px;
                padding: 32px; 
                max-width: 480px; 
                margin: 0 auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header { 
                text-align: center; 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 32px;
                color: #1f2937;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 16px;
              }
              .row { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start;
                margin: 16px 0; 
                padding: 12px 0;
                border-bottom: 1px solid #f3f4f6;
              }
              .row:last-child { border-bottom: none; }
              .label { 
                font-weight: 600; 
                color: #6b7280;
                min-width: 120px;
              }
              .value {
                text-align: right;
                flex: 1;
                font-weight: 500;
                color: #1f2937;
              }
              .amount { 
                font-size: 20px; 
                font-weight: bold; 
                color: #059669; 
              }
              .footer {
                text-align: center; 
                margin-top: 32px; 
                font-style: italic;
                color: #6b7280;
                font-size: 14px;
                padding-top: 16px;
                border-top: 2px solid #e5e7eb;
              }
              @media print { 
                body { margin: 0; padding: 10px; background: white; }
                .receipt { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                  📧 Payment Receipt
                </div>
              </div>
              <div class="row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(payment.paidAt || payment.date || new Date().toISOString())}</span>
              </div>
              <div class="row">
                <span class="label">Description:</span>
                <span class="value">${payment.chargeTitle || payment.description || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Method:</span>
                <span class="value">${payment.method || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Amount:</span>
                <span class="value amount">$${formatAmount(payment.amount)}</span>
              </div>
              <div class="row">
                <span class="label">Payment ID:</span>
                <span class="value" style="font-family: monospace; font-size: 12px;">${payment.id || 'N/A'}</span>
              </div>
              <div class="footer">
                Thank you for your payment!
              </div>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className={`relative w-full max-w-lg ${styles.card.background} rounded-2xl shadow-2xl border ${styles.border} overflow-hidden transform transition-all duration-300`}>
                {/* Modal Header */}
                <div className={`px-6 py-4 border-b ${styles.border} flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${styles.accent} text-white`}>
                            <FaReceipt size={16} />
                        </div>
                        <h3 className={`text-xl font-bold ${styles.textPrimary}`}>
                            Payment Receipt
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 ${styles.textSecondary} hover:text-gray-700`}
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border ${styles.border} ${styles.card.background} shadow-sm`}>
                            <div className="space-y-4">
                                <div className={`flex justify-between items-center py-3 border-b ${styles.border}`}>
                                    <span className={`text-sm font-semibold ${styles.textSecondary} uppercase tracking-wide`}>
                                        Date
                                    </span>
                                    <span className={`text-sm font-medium ${styles.textPrimary}`}>
                                        {formatDate(payment.paidAt || payment.date || new Date().toISOString())}
                                    </span>
                                </div>

                                <div className={`flex justify-between items-start py-3 border-b ${styles.border}`}>
                                    <span className={`text-sm font-semibold ${styles.textSecondary} uppercase tracking-wide`}>
                                        Description
                                    </span>
                                    <span className={`text-sm font-medium ${styles.textPrimary} text-right max-w-[240px] break-words`}>
                                        {payment.chargeTitle || payment.description || 'N/A'}
                                    </span>
                                </div>

                                <div className={`flex justify-between items-center py-3 border-b ${styles.border}`}>
                                    <span className={`text-sm font-semibold ${styles.textSecondary} uppercase tracking-wide`}>
                                        Payment Method
                                    </span>
                                    <span className={`text-sm font-medium ${styles.textPrimary}`}>
                                        {payment.method || 'N/A'}
                                    </span>
                                </div>

                                <div className={`flex justify-between items-center py-3 border-b ${styles.border}`}>
                                    <span className={`text-sm font-semibold ${styles.textSecondary} uppercase tracking-wide`}>
                                        Amount
                                    </span>
                                    <span className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#34D399' : '#059669' }}>
                                        ₹{formatAmount(payment.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDownloadReceipt}
                                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm`}
                            >
                                <FaDownload size={16} />
                                Download Receipt
                            </button>

                            <button
                                onClick={handlePrintReceipt}
                                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm`}
                            >
                                <FaPrint size={16} />
                                Print Receipt
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className={`w-full px-6 py-3 border-2 ${styles.border} ${styles.textPrimary} rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 text-sm`}
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className={`px-6 py-4 border-t ${styles.border} ${styles.card.background} text-center`}>
                    <p className={`text-xs ${styles.textSecondary} italic`}>
                        Thank you for your payment!
                    </p>
                </div>
            </div>
        </div>
    );
}