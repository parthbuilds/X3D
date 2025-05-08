// app/admin/users/page.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { PageHeader } from "../_components/PageHeader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { DeleteDropDownItem } from "./_components/UserActions"

// Ensure this page is dynamically rendered (not pre-rendered at build time)
export const dynamic = "force-dynamic"

async function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <>
      <PageHeader>Customers</PageHeader>
      {users.length === 0 ? (
        <p className="p-4">No customers found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatNumber(user.orders.length)}</TableCell>
                <TableCell>
                  {formatCurrency(
                    user.orders.reduce(
                      (sum, o) => sum + o.pricePaidInCents,
                      0
                    ) / 100
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DeleteDropDownItem id={user.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
