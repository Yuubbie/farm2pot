"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../../lib/supabase-browser";
import { User, Mail, Lock, Shield, Bell, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Truck } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      setProfileMessage({ type: "error", text: error.message });
    } else {
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setProfileLoading(false);
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <motion.section
        className="rounded-2xl border border-charcoal/10 bg-cream p-6 sm:p-8 shadow-elevation-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <User className="h-5 w-5 text-terracotta" />
          </div>
          <h2 className="font-display text-xl font-semibold text-charcoal">Profile Information</h2>
        </div>

        <form onSubmit={updateProfile} className="space-y-5 max-w-md">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                placeholder="Your name"
                autoComplete="name"
                disabled={profileLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-charcoal/20 bg-charcoal/5 px-4 py-3 pl-11 text-body text-charcoal/50 cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>
            <p className="mt-1 text-xs text-charcoal/50">Email cannot be changed from here</p>
          </div>

          <motion.button
            type="submit"
            disabled={profileLoading}
            className="w-full rounded-full bg-terracotta py-3 text-base font-body font-semibold text-cream transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(242,185,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            {profileLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </motion.button>

          <AnimatePresence>
            {profileMessage && (
              <motion.div
                className={`flex items-center gap-3 rounded-xl p-4 ${
                  profileMessage.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{profileMessage.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.section>

      {/* Password Section */}
      <motion.section
        className="rounded-2xl border border-charcoal/10 bg-cream p-6 sm:p-8 shadow-elevation-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <Shield className="h-5 w-5 text-terracotta" />
          </div>
          <h2 className="font-display text-xl font-semibold text-charcoal">Change Password</h2>
        </div>

        <form onSubmit={updatePassword} className="space-y-5 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 pr-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={passwordLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/60 transition-colors"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-charcoal/70 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 pr-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={passwordLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/60 transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal/70 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 pr-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={passwordLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/60 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={passwordLoading}
            className="w-full rounded-full bg-terracotta py-3 text-base font-body font-semibold text-cream transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(242,185,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            {passwordLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </motion.button>

          <AnimatePresence>
            {passwordMessage && (
              <motion.div
                className={`flex items-center gap-3 rounded-xl p-4 ${
                  passwordMessage.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{passwordMessage.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.section>

      {/* Preferences Section */}
      <motion.section
        className="rounded-2xl border border-charcoal/10 bg-cream p-6 sm:p-8 shadow-elevation-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <Bell className="h-5 w-5 text-terracotta" />
          </div>
          <h2 className="font-display text-xl font-semibold text-charcoal">Preferences</h2>
        </div>

        <div className="space-y-4 max-w-md">
          <PreferenceToggle
            title="Order Notifications"
            description="Receive updates about your order status via WhatsApp"
            icon={<Bell className="h-5 w-5" />}
            defaultChecked
          />
          <PreferenceToggle
            title="Promotional Messages"
            description="Get notified about special offers and new menu items"
            icon={<Bell className="h-5 w-5" />}
          />
          <PreferenceToggle
            title="Delivery Updates"
            description="Real-time tracking when your order is out for delivery"
            icon={<Truck className="h-5 w-5" />}
            defaultChecked
          />
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="font-display text-xl font-semibold text-red-800">Danger Zone</h2>
        </div>

        <div className="max-w-md">
          <p className="text-body text-red-700 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="w-full rounded-full border-2 border-red-400 bg-transparent py-3 text-base font-body font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-600">
            Delete Account
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function PreferenceToggle({
  title,
  description,
  icon,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-charcoal/10 bg-cream transition-colors hover:border-terracotta/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
          {icon}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-charcoal">{title}</p>
          <p className="text-xs text-charcoal/50">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-terracotta" : "bg-charcoal/10"
        }`}
        role="switch"
        aria-checked={checked}
        aria-label={title}
      >
        <motion.span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream shadow transition-transform"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
      </button>
    </div>
  );
}

