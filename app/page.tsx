
export default async function Home() {
  const log = () => {
    console.log("Started analyzing");
  };
  return (
    <div className=" h-full w-full flex items-center justify-center h-full p-8">
      <div className="flex flex-col justify-center items-center  gap-3" >
        This is the home or something
      </div>
    </div>
  )
}