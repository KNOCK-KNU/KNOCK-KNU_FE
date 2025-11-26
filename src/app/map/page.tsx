export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">KNU 맵</h1>
      <p className="text-gray-600 text-center max-w-md">
        학교 반경 1km 내 식당, 카페, 편의시설을 지도에서 확인하세요!
      </p>
      <p className="text-sm text-gray-400 mt-4">
        (지도 API 연동은 백엔드 팀에서 진행 예정)
      </p>
    </div>
  );
}
