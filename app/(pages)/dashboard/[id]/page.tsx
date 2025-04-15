export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-3">
        <h1 className="worksans text-md grey800">Analytics dashboard</h1>
        <h1 className="worksans text-2xl">Search title: {id}</h1>
      </div>
      <div>other info</div>
    </div>
  );
}
