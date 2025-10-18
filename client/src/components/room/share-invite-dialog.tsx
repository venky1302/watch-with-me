import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

interface ShareInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomCode: string;
  roomName: string;
}

export function ShareInviteDialog({ open, onOpenChange, roomCode, roomName }: ShareInviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/room/${roomCode}`;
  const shareText = `Join me on Watch With Me! Room: ${roomName}\nCode: ${roomCode}\n${inviteUrl}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    copyToClipboard(shareText);
    alert("Link copied! Open Instagram and paste it in a message or story.");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${roomName} on Watch With Me`,
          text: shareText,
          url: inviteUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share the room code or link with friends to watch together
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Room Code */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Room Code</Label>
            <div className="flex gap-2">
              <Input
                value={roomCode}
                readOnly
                className="font-mono text-2xl tracking-widest text-center"
                data-testid="input-room-code-display"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(roomCode)}
                data-testid="button-copy-code"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Invite Link */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Invite Link</Label>
            <div className="flex gap-2">
              <Input
                value={inviteUrl}
                readOnly
                className="text-sm"
                data-testid="input-invite-url"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(inviteUrl)}
                data-testid="button-copy-link"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Share Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Share To</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareToWhatsApp}
                className="justify-start gap-2"
                data-testid="button-share-whatsapp"
              >
                <SiWhatsapp className="w-5 h-5" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={shareToInstagram}
                className="justify-start gap-2"
                data-testid="button-share-instagram"
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </Button>
              {navigator.share && (
                <Button
                  variant="outline"
                  onClick={nativeShare}
                  className="justify-start gap-2 col-span-2"
                  data-testid="button-share-native"
                >
                  <Share2 className="w-5 h-5" />
                  More Options...
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
