import React from 'react';
import { Phone, Edit, Trash2 } from 'lucide-react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Address } from '@/hooks/useAddresses';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, isSelected, onEdit, onDelete }) => {
  return (
    <label
      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <RadioGroupItem value={address.id} className="mt-1" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{address.name}</span>
          {address.is_default && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
              Default
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {address.street}, {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <Phone className="h-3 w-3" />
          {address.phone}
        </p>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            onEdit(address);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete(address.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </label>
  );
};

export default AddressCard;
