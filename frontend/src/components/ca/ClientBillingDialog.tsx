import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IndianRupee, Percent } from 'lucide-react';

interface ClientBillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSubmit: (clientId: string, billing: { total: number; received: number; discount: number }) => Promise<void>;
}

export function ClientBillingDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
}: ClientBillingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState('');
  const [discount, setDiscount] = useState('');
  const [received, setReceived] = useState('');

  useEffect(() => {
    if (client) {
      setTotal(client.billingTotal.toString());
      setDiscount((client.billingDiscount || 0).toString());
      setReceived(client.billingReceived.toString());
    }
  }, [client, open]);

  const totalAmount = parseFloat(total) || 0;
  const discountAmount = parseFloat(discount) || 0;
  const receivedAmount = parseFloat(received) || 0;
  const netAmount = Math.max(0, totalAmount - discountAmount);
  const pending = Math.max(0, netAmount - receivedAmount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(client.id, {
        total: totalAmount,
        received: receivedAmount,
        discount: discountAmount,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Billing</DialogTitle>
          <DialogDescription>
            Update billing status for {client.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total Billing */}
          <div className="space-y-2">
            <Label htmlFor="total">Total Billing Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="total"
                type="number"
                placeholder="0"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="pl-10"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Amount Received */}
          <div className="space-y-2">
            <Label htmlFor="received">Amount Received</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="received"
                type="number"
                placeholder="0"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                className="pl-10"
                min="0"
                max={netAmount.toString()}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount Amount</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="pl-10"
                min="0"
                max={total}
                disabled={isSubmitting}
              />
            </div>
            {discountAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                Discount: {((discountAmount / totalAmount) * 100).toFixed(1)}% off
              </p>
            )}
          </div>

          {/* Billing Summary */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-blue-600">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground">Net Amount:</span>
              <span className="font-semibold">{formatCurrency(netAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Received:</span>
              <span className="font-medium text-green-600">{formatCurrency(receivedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-bold text-orange-600">{formatCurrency(pending)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Updating...
                </div>
              ) : (
                'Update Billing'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
