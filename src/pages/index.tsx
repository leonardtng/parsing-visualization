import { LandingView, PageTemplate } from "@/components";
import { APPS } from "@/constants";

export default function Home() {
  return (
    <PageTemplate app={APPS.home} className="p-24">
      <LandingView />
    </PageTemplate>
  );
}
