import { permanentRedirect } from 'next/navigation';

export default function UnitConverterRedirectPage() {
  permanentRedirect('/conversions/length');
}
