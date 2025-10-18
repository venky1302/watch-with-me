import { type AvatarId } from "@shared/schema";

import avatar1 from "@assets/generated_images/Avatar_1_-_Friendly_character_91771157.png";
import avatar2 from "@assets/generated_images/Avatar_2_-_Person_with_glasses_f9f3bdad.png";
import avatar3 from "@assets/generated_images/Avatar_3_-_Curly_hair_character_60698594.png";
import avatar4 from "@assets/generated_images/Avatar_4_-_Short_hair_character_38b84e72.png";
import avatar5 from "@assets/generated_images/Avatar_5_-_Long_hair_character_4aa37b55.png";
import avatar6 from "@assets/generated_images/Avatar_6_-_Person_with_beanie_cc6f992f.png";
import avatar7 from "@assets/generated_images/Avatar_7_-_Wavy_hair_character_77d02c15.png";
import avatar8 from "@assets/generated_images/Avatar_8_-_Person_with_headphones_d1fe53d6.png";
import avatar9 from "@assets/generated_images/Avatar_9_-_Natural_hair_character_691d11de.png";
import avatar10 from "@assets/generated_images/Avatar_10_-_Stylish_hair_character_732d4127.png";
import avatar11 from "@assets/generated_images/Avatar_11_-_Medium_hair_character_24bfa641.png";
import avatar12 from "@assets/generated_images/Avatar_12_-_Person_with_cap_1c670b09.png";

export const AVATARS: Record<AvatarId, string> = {
  "avatar-1": avatar1,
  "avatar-2": avatar2,
  "avatar-3": avatar3,
  "avatar-4": avatar4,
  "avatar-5": avatar5,
  "avatar-6": avatar6,
  "avatar-7": avatar7,
  "avatar-8": avatar8,
  "avatar-9": avatar9,
  "avatar-10": avatar10,
  "avatar-11": avatar11,
  "avatar-12": avatar12,
};

export function getAvatarUrl(avatarId: AvatarId): string {
  return AVATARS[avatarId];
}
