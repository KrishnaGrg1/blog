import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight ">Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and photo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <UpdateProfileForm
                user={{ ...user, image: user.image ?? null }}
              />
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <UpdatePasswordForm />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 shadow-lg">
            <CardHeader className="border-b bg-red-50/50">
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Delete Account
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Once you delete your account, there is no going back. All
                    your blogs and data will be permanently deleted.
                  </p>
                  <DeleteAccountButton userId={user.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
