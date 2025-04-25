export default function CardInstructor({ instructor }) {
  return (
    <div className="w-96 h-72 p-4 px-8 rounded-md shadow-lg flex flex-col justify-center items-center">
      <div className="relative">
        <img
          src={instructor.profilePict}
          alt=""
          className="rounded-full object-cover w-24 h-24"
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-gray-300"
          style={{ top: "-6px", left: "-6px", right: "-6px", bottom: "-6px" }}
        ></div>
      </div>
      <p className="mt-4 text-xl font-bold">{instructor.name}</p>
      <p>{instructor.courseSpecific}</p>
      <p>{instructor.manyHeld} courses</p>
    </div>
  );
}
