import { Profile } from ".";

export default function ProfilePage() {
  return (
    <div className="pt-8 w-4/5 mx-auto flex flex-col justify-between h-screen">
      <main className="flex-1 overflow-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Profile.Content />
            <Profile.LastBookings />
          </div>
          <Profile.Activity />
        </div>
      </main>
    </div>
  );
}
