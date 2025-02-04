import { Profile } from ".";

export default function ProfilePage() {
  return (
    <div className="pt-8 w-4/5 mx-auto flex flex-col justify-between h-screen">
      <main className="flex-1 overflow-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Profile.Content />
          </div>
          <div>
            <Profile.LastBookings />
          </div>
        </div>
      </main>
    </div>
  );
}
