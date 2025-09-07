"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Users, SettingsIcon } from "lucide-react"

export default function Settings() {
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()

    if (adminData.password !== adminData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    console.log("Adding new admin:", adminData)
    // Here you would typically send the data to your backend
    alert("Admin added successfully!")
    setIsAddAdminOpen(false)
    setAdminData({ username: "", password: "", confirmPassword: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage admin users and permissions</p>
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Admin</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={adminData.username}
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Password Confirmation</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={adminData.confirmPassword}
                      onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Sign Up
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Backup & Restore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Backup and restore system data</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Create Backup
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Restore Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
