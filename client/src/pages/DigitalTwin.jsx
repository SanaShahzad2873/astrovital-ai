import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import DemoBanner from '../components/ui/DemoBanner'
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews'
import TwinHero from '../components/twin/TwinHero'
import RegionDetailPanel from '../components/twin/RegionDetailPanel'
import useAsync from '../hooks/useAsync'
import { getAstronautState } from '../services/api'
import { REGION_LABELS } from '../config/bodyRegions'

export default function DigitalTwin() {
  const { data, error, loading, reload } = useAsync(getAstronautState)
  const [params] = useSearchParams()
  const initial = params.get('region')
  const [selected, setSelected] = useState(initial in REGION_LABELS ? initial : null)

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return <EmptyState />

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div className="grid gap-4 2xl:grid-cols-[1fr_440px]">
        <Card title="Astronaut body map" className="hero-stage">
          <TwinHero regions={data.bodyRegions} selected={selected} onSelect={setSelected} />
        </Card>
        <RegionDetailPanel regionKey={selected} regions={data.bodyRegions} domains={data.domains} />
      </div>
    </div>
  )
}