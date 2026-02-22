import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdraeObserverPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl text-white font-bold">ADRAE — Observer Layer</h1>
        <p className="text-gray-400 text-sm mt-1">Sovereign Cognitive Substrate</p>
      </div>

      <div className="h-px bg-white/10" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-white">
            Runtime Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Runtime</span>
            <span className="text-white">Stable</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-white">
            Coherence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Coherence</span>
            <span className="text-white">1.0</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-white">
            Drift
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Drift</span>
            <span className="text-white">0.0</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-white">
            State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">State</span>
            <span className="text-white font-mono">QUIET_WAKE</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
