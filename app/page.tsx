import { HomeTool } from '@/components/HomeTool';
import HomeSeoContent from '@/components/HomeSeoContent';

export default function HomePage() {
  return <HomeTool seoAfterTool={<HomeSeoContent />} />;
}
