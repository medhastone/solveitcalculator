import { permanentRedirect } from 'next/navigation';

export default function AllCalculatorsRedirectPage() {
  permanentRedirect('/calculators');
}
