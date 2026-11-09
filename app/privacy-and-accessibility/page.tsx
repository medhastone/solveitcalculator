import { permanentRedirect } from 'next/navigation';

export default function PrivacyAndAccessibilityRedirectPage() {
  permanentRedirect('/privacy-policy');
}
