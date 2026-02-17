import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageOff } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Profile customization options
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-8">
          <ImageOff className="h-16 w-16 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Profile picture upload coming soon
            </p>
            <p className="text-xs text-muted-foreground/70">
              Additional profile customization features will be available in a future update
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
