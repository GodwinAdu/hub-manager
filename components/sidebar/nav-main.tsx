"use client"

import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import type React from "react"
import {
  Users,
  ChevronRight,
  ShoppingBag,
  HandCoins,
  PiggyBank,
  Activity,
  Settings,
  GraduationCap,
  UsersRound,
  BookOpen,
  Building2,
  Library,
  Mail,
  ChefHat,
  History,
  Trash2,
  Receipt,
  Calendar,
  Stethoscope,
  CheckSquare,
  UserCheck,
  Phone,
  MessageSquare,
  FileText,
  Clock,
  Shield,
  Database,
  Award,
  TrendingUp,
  DollarSign,
  Package,
  Bed,
  Search,
  Bell,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileBarChart,
  Calculator,
  CreditCard,
  Wallet,
  BookMarked,
  UserPlus,
  ClipboardList,
  MapPin,
  Utensils,
  HeartHandshake,
  School,
  Brain,
  Target,
  Zap,
  PiggyBankIcon,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useCallback, useEffect, useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import type { IRole, ISchool } from "@/types"

interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  roleField?: keyof IRole | string
  isActive?: boolean
  badge?: string | number
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  items?: NavItem[]
  description?: string
  isNew?: boolean
  isPro?: boolean
}

interface NavMainProps {
  role: IRole | undefined
  school: ISchool
}

export function NavMain({ role, school }: NavMainProps) {
  const params = useParams()
  const pathname = usePathname()
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const proPlan = school?.subscriptionPlan?.plan === "pro"
  const { organizationId, userId } = params

  const navMain: (NavItem | false)[] = [
    {
      title: "Dashboard",
      url: `/${organizationId}/dashboard/${userId}`,
      icon: BarChart3,
      description: "Overview and analytics",
      badge: "5",
      badgeVariant: "secondary",
    },
    {
      title: "Academics & Learning",
      url: "#",
      icon: GraduationCap,
      description: "Educational management",
      roleField: "classManagement",
      items: [
        {
          title: "Attendance Tracking",
          url: `/${organizationId}/dashboard/${userId}/class/attendance`,
          icon: UserCheck,
          roleField: "manageClass",
        },
        {
          title: "Assignment Center",
          url: `/${organizationId}/dashboard/${userId}/class/assignment`,
          icon: FileText,
          roleField: "manageClass",
        },
        {
          title: "Class Management",
          url: `/${organizationId}/dashboard/${userId}/class/manage-classes`,
          icon: School,
          roleField: "manageClass",
        },
        {
          title: "Subject Catalog",
          url: `/${organizationId}/dashboard/${userId}/class/manage-subjects`,
          icon: BookOpen,
          roleField: "manageSubject",
        },
        {
          title: "Timetable Scheduler",
          url: `/${organizationId}/dashboard/${userId}/class/timetable`,
          icon: Calendar,
          roleField: "manageSubject",
        },
        {
          title: "Class Fees",
          url: `/${organizationId}/dashboard/${userId}/class/class-fees`,
          icon: DollarSign,
          isPro:true,
          roleField: "manageClass",
        },
        {
          title: "Student Promotion",
          url: `/${organizationId}/dashboard/${userId}/class/promotion`,
          icon: TrendingUp,
          roleField: "manageSubject",
        },
      ],
    },
    {
      title: "Admission Portal",
      url: `/${organizationId}/dashboard/${userId}/admissions`,
      icon: UserPlus,
      description: "Manage student admissions",
      badge: "12",
      badgeVariant: "default",
      isPro: true
    },
    {
      title: "Canteen Management",
      url: "#",
      icon: ChefHat,
      isPro: true,
      description: "Food service operations",
      roleField: "canteenManagement",
      items: [
        {
          title: "Meal Assignment",
          url: `/${organizationId}/dashboard/${userId}/canteen/assign-meal`,
          icon: Utensils,
          roleField: "canteenManagement",
        },
        {
          title: "Menu Planning",
          url: `/${organizationId}/dashboard/${userId}/canteen/meal-plan`,
          icon: BookMarked,
          roleField: "canteenManagement",
        },
        {
          title: "Meal Schedule",
          url: `/${organizationId}/dashboard/${userId}/canteen/meal-schedule`,
          icon: Clock,
          roleField: "canteenManagement",
        },
        {
          title: "Dining Timetable",
          url: `/${organizationId}/dashboard/${userId}/canteen/meal-timetable`,
          icon: Calendar,
          roleField: "canteenManagement",
        },
        {
          title: "Payment Processing",
          url: `/${organizationId}/dashboard/${userId}/canteen/payment`,
          icon: CreditCard,
          roleField: "canteenManagement",
        },
      ],
    },
    {
      title: "Communication Hub",
      url: "#",
      icon: Mail,
      description: "Messaging and notifications",
      roleField: "message",
      isPro: true,
      items: [
        {
          title: "Bulk Messaging",
          url: `/${organizationId}/dashboard/${userId}/messaging/bulk-email`,
          icon: Mail,
          roleField: "message",
        },
        {
          title: "Email Center",
          url: `/${organizationId}/dashboard/${userId}/messaging/email`,
          icon: MessageSquare,
          roleField: "message",
        },
        {
          title: "Discussion Forums",
          url: `/${organizationId}/forum`,
          icon: Users,
          roleField: "message",
        },
      ],
    },
    {
      title: "Events & Calendar",
      url: `/${organizationId}/dashboard/${userId}/events`,
      icon: Calendar,
      description: "School events and scheduling",
      isNew: true,
    },
    {
      title: "Examination System",
      url: "#",
      icon: Brain,
      description: "Assessment and evaluation",
      roleField: "examsManagement",
      isPro: true,
      items: [
        {
          title: "Question Bank",
          url: `/${organizationId}/dashboard/${userId}/exam/questions`,
          icon: BookOpen,
          roleField: "manageExam",
        },
        {
          title: "Exam Hall",
          url: `/${organizationId}/dashboard/${userId}/exam/exams-hall`,
          icon: School,
          roleField: "manageExam",
        },
        {
          title: "Paper Distribution",
          url: `/${organizationId}/dashboard/${userId}/exam/distribution`,
          icon: FileText,
          roleField: "manageExam",
        },
        {
          title: "Question Reviews",
          url: `/${organizationId}/dashboard/${userId}/exam/question-reviews`,
          icon: CheckCircle,
          roleField: "manageExam",
        },
        {
          title: "Exam Configuration",
          url: `/${organizationId}/dashboard/${userId}/exam/exam-setup`,
          icon: Settings,
          roleField: "manageExam",
        },
        {
          title: "Exam Scheduling",
          url: `/${organizationId}/dashboard/${userId}/exam/exam-schedule`,
          icon: Calendar,
          roleField: "manageExam",
        },
        {
          title: "Grade Entry",
          url: `/${organizationId}/dashboard/${userId}/exam/mark-entries`,
          icon: Calculator,
          roleField: "manageExam",
        },
        {
          title: "Ranking System",
          url: `/${organizationId}/dashboard/${userId}/exam/generate-position`,
          icon: Award,
          roleField: "manageExam",
        },
        {
          title: "Grading Scale",
          url: `/${organizationId}/dashboard/${userId}/exam/grade-ranges`,
          icon: BarChart3,
          roleField: "manageExam",
        },
      ],
    },
    {
      title: "Financial Management",
      url: "#",
      icon: HandCoins,
      description: "Fee and payment system",
      roleField: "feesManagement",
      isPro: true,
      items: [
        {
          title: "Fee Structure",
          url: `/${organizationId}/dashboard/${userId}/manage-fees/fees-structures`,
          icon: Calculator,
          roleField: "manageFees",
        },
        {
          title: "Payment Setup",
          url: `/${organizationId}/dashboard/${userId}/manage-fees/fine-setup`,
          icon: Settings,
          roleField: "manageFees",
        },
        {
          title: "Fee Collection",
          url: `/${organizationId}/dashboard/${userId}/manage-fees/fees-payment`,
          icon: CreditCard,
          roleField: "manageFees",
        },
        {
          title: "Payment Reminders",
          url: `/${organizationId}/dashboard/${userId}/manage-fees/fees-reminder`,
          icon: Bell,
          roleField: "manageFees",
        },
        {
          title: "Invoice Generator",
          url: `/${organizationId}/dashboard/${userId}/manage-fees/invoice`,
          icon: Receipt,
          roleField: "manageFees",
        },
      ],
    },
      {
      title: "Financial Tracking",
      url: "#",
      icon: PiggyBank,
      description: "Income and expense management",
      roleField: "depositAndExpense",
      isPro: true,
      items: [
        {
          title: "Account Management",
          url: `/${organizationId}/dashboard/${userId}/deposit-expenses/accounts`,
          icon: Wallet,
          roleField: "manageAccount",
        },
        {
          title: "Income Tracking",
          url: `/${organizationId}/dashboard/${userId}/deposit-expenses/new-deposits`,
          icon: TrendingUp,
          roleField: "manageAccount",
        },
        {
          title: "Expense Recording",
          url: `/${organizationId}/dashboard/${userId}/deposit-expenses/new-expenses`,
          icon: HandCoins,
          roleField: "manageAccount",
        },
        {
          title: "Transaction History",
          url: `/${organizationId}/dashboard/${userId}/deposit-expenses/all-transactions`,
          icon: History,
          roleField: "manageAccount",
        },
      ],
    },
    {
      title: "Front Desk Operations",
      url: "#",
      icon: Shield,
      description: "Reception and visitor management",
      roleField: "systemConfig",
      isPro: true,
      items: [
        {
          title: "Admission Desk",
          url: `/${organizationId}/dashboard/${userId}/front-desk/admission`,
          icon: ClipboardList,
          roleField: "manageSession",
        },
        {
          title: "Postal Records",
          url: `/${organizationId}/dashboard/${userId}/front-desk/postal-records`,
          icon: Mail,
          roleField: "manageSession",
        },
        {
          title: "Call Management",
          url: `/${organizationId}/dashboard/${userId}/front-desk/call-logs`,
          icon: Phone,
          roleField: "manageSession",
        },
        {
          title: "Visitor Registry",
          url: `/${organizationId}/dashboard/${userId}/front-desk/visitor-logs`,
          icon: MapPin,
          roleField: "manageSession",
        },
        {
          title: "Complaints & Feedback",
          url: `/${organizationId}/dashboard/${userId}/front-desk/complaints`,
          icon: MessageSquare,
          roleField: "manageSession",
          badge: "3",
          badgeVariant: "destructive",
        },
      ],
    },
    {
      title: "Health Center",
      url: "#",
      icon: Stethoscope,
      description: "Medical records and health tracking",
      roleField: "healthManagement",
      isPro: true,
      items: [
        {
          title: "Medical Records",
          url: `/${organizationId}/dashboard/${userId}/health/admissions`,
          icon: FileText,
          roleField: "manageHealth",
        },
        {
          title: "Appointments",
          url: `/${organizationId}/dashboard/${userId}/health/appointments`,
          icon: Calendar,
          roleField: "manageHealth",
        },
        {
          title: "Medical Billing",
          url: `/${organizationId}/dashboard/${userId}/health/billing`,
          icon: Receipt,
          roleField: "manageHealth",
        },
        {
          title: "Health Alerts",
          url: `/${organizationId}/dashboard/${userId}/health/health-alerts`,
          icon: AlertCircle,
          roleField: "manageHealth",
          badge: "2",
          badgeVariant: "destructive",
        },
        {
          title: "Health Education",
          url: `/${organizationId}/dashboard/${userId}/health/health-education`,
          icon: BookOpen,
          roleField: "manageHealth",
        },
        {
          title: "Lab Results",
          url: `/${organizationId}/dashboard/${userId}/health/lab-results`,
          icon: Activity,
          roleField: "manageHealth",
        },
        {
          title: "Medications",
          url: `/${organizationId}/dashboard/${userId}/health/medications`,
          icon: Zap,
          roleField: "manageHealth",
        },
        {
          title: "Vaccination Records",
          url: `/${organizationId}/dashboard/${userId}/health/vaccinations`,
          icon: Shield,
          roleField: "manageHealth",
        },
        {
          title: "Symptom Tracker",
          url: `/${organizationId}/dashboard/${userId}/health/symptom-checker`,
          icon: Search,
          roleField: "manageHealth",
        },
      ],
    },
    {
      title: "Hostel Operations",
      url: "#",
      icon: Bed,
      description: "Residential facility management",
      roleField: "hostelManagement",
      isPro: true,
      items: [
        {
          title: "Hostel Management",
          url: `/${organizationId}/dashboard/${userId}/hostel/manage-hostel`,
          icon: Building2,
          roleField: "manageHostel",
        },
        {
          title: "Room Allocation",
          url: `/${organizationId}/dashboard/${userId}/hostel/hostel-room`,
          icon: Bed,
          roleField: "manageHostel",
        },
        {
          title: "Maintenance Requests",
          url: `/${organizationId}/dashboard/${userId}/hostel/maintenance`,
          icon: Settings,
          roleField: "manageHostel",
        },
        {
          title: "Payment Dues",
          url: `/${organizationId}/dashboard/${userId}/hostel/hostel-fees`,
          icon:PiggyBankIcon,
          roleField: "manageHostel",
        },
      ],
    },
     {
      title: "HR & Payroll",
      url: "#",
      icon: Wallet,
      description: "Human resources management",
      roleField: "hrManagement",
      isPro: true,
      items: [
        {
          title: "Salary Structure",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/salary-structure`,
          icon: Calculator,
          roleField: "manageHr",
        },
        {
          title: "Salary Assignment",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/salary-assign`,
          icon: UserCheck,
          roleField: "manageHr",
        },
        {
          title: "Payroll Processing",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/salary-payment`,
          icon: DollarSign,
          roleField: "manageHr",
        },
        {
          title: "Salary Requests",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/request-salary`,
          icon: HandCoins,
          roleField: "manageRequestSalary",
        },
        {
          title: "Request Management",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/manage-request-salary`,
          icon: CheckSquare,
          roleField: "manageHr",
        },
        {
          title: "Leave Categories",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/leave-category`,
          icon: Calendar,
          roleField: "manageLeaveCategory",
        },
        {
          title: "Leave Requests",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/request-leave`,
          icon: Clock,
          roleField: "manageRequestLeave",
        },
        {
          title: "Leave Management",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/manage-leave`,
          icon: CheckCircle,
          roleField: "manageHr",
        },
        {
          title: "Awards & Recognition",
          url: `/${organizationId}/dashboard/${userId}/hr-payroll/awards`,
          icon: Award,
          roleField: "manageHr",
        },
      ],
    },
    {
      title: "Inventory Control",
      url: "#",
      icon: Package,
      description: "Asset and supply management",
      roleField: "inventory",
      isPro:true,
      items: [
        {
          title: "Store Management",
          url: `/${organizationId}/dashboard/${userId}/inventory/stores`,
          icon: Building2,
          roleField: "manageInventory",
        },
        {
          title: "Item Categories",
          url: `/${organizationId}/dashboard/${userId}/inventory/category`,
          icon: CheckSquare,
          roleField: "manageInventory",
        },
        {
          title: "Product Catalog",
          url: `/${organizationId}/dashboard/${userId}/inventory/products`,
          icon: ShoppingBag,
          roleField: "manageInventory",
        },
        {
          title: "Supplier Network",
          url: `/${organizationId}/dashboard/${userId}/inventory/suppliers`,
          icon: UsersRound,
          roleField: "manageInventory",
        },
        {
          title: "Purchase Orders",
          url: `/${organizationId}/dashboard/${userId}/inventory/purchase`,
          icon: Receipt,
          roleField: "manageInventory",
        },
        {
          title: "Item Distribution",
          url: `/${organizationId}/dashboard/${userId}/inventory/issue`,
          icon: Package,
          roleField: "manageInventory",
        },
      ],
    },
    {
      title: "Library System",
      url: "#",
      icon: Library,
      description: "Digital library management",
      roleField: "library",
      isPro: true,
      items: [
        {
          title: "Book Catalog",
          url: `/${organizationId}/dashboard/${userId}/library/manage-books`,
          icon: BookOpen,
          roleField: "manageLibrary",
        },
        {
          title: "Book Circulation",
          url: `/${organizationId}/dashboard/${userId}/library/manage-issue-books`,
          icon: BookMarked,
          roleField: "manageLibrary",
        },
      ],
    },
     {
      title: "Staff Management",
      url: "#",
      icon: UsersRound,
      description: "Employee dashboardistration",
      roleField: "employeeManagement",
      items: [
        {
          title: "Departments",
          url: `/${organizationId}/dashboard/${userId}/manage-employee/add-department`,
          icon: Building2,
          roleField: "manageEmployee",
        },
        {
          title: "Employee Directory",
          url: `/${organizationId}/dashboard/${userId}/manage-employee/employee-list`,
          icon: Users,
          roleField: "manageEmployee",
        },
        {
          title: "Staff Registration",
          url: `/${organizationId}/dashboard/${userId}/manage-employee/manage-employees`,
          icon: UserPlus,
          roleField: "manageEmployee",
        },
      ],
    },
      {
      title: "Student Management",
      url: "#",
      icon: Users,
      description: "Student information system",
      roleField: "studentManagement",
      items: [
        {
          title: "Bulk Registration",
          url: `/${organizationId}/dashboard/${userId}/manage-students/bulk-students`,
          icon: UserPlus,
          roleField: "manageStudent",
        },
        {
          title: "Student Categories",
          url: `/${organizationId}/dashboard/${userId}/manage-students/student-type`,
          icon: CheckSquare,
          roleField: "manageStudent",
        },
        {
          title: "Student Directory",
          url: `/${organizationId}/dashboard/${userId}/manage-students/manage-student`,
          icon: Users,
          roleField: "manageStudent",
        },
        {
          title: "Parent Portal",
          url: `/${organizationId}/dashboard/${userId}/manage-students/manage-parent`,
          icon: UsersRound,
          roleField: "manageStudent",
        },
      ],
    },
     {
      title: "Student Wellbeing",
      url: "#",
      icon: HeartHandshake,
      isPro:true,
      description: "Student support services",
      roleField: "studentManagement",
      items: [
        {
          title: "Wellbeing Programs",
          url: `/${organizationId}/dashboard/${userId}/student-wellbeing/wellbeing`,
          icon: Target,
          roleField: "manageStudent",
        },
      ],
    },
    {
      title: "System Configuration",
      url: "#",
      icon: Settings,
      description: "Core system settings",
      roleField: "systemConfig",
      items: [
        {
          title: "Academic Sessions",
          url: `/${organizationId}/dashboard/${userId}/system-config/manage-sessions`,
          icon: Calendar,
          roleField: "manageSession",
        },
        {
          title: "Role Management",
          url: `/${organizationId}/dashboard/${userId}/system-config/manage-role`,
          icon: Shield,
          roleField: "manageRole",
        },
        {
          title: "Audit & Security",
          url: `/${organizationId}/dashboard/${userId}/system-config/audit-logs`,
          icon: Database,
          roleField: "manageTerm",
        },
      ],
    },
    {
      title: "Analytics & Reports",
      url: "#",
      icon: FileBarChart,
      description: "Data insights and reporting",
      roleField: "report",
      items: [
        {
          title: "Balance Sheet",
          url: `/${organizationId}/dashboard/${userId}/reports/balance-sheet`,
          icon: Calculator,
          roleField: "studentReport",
        },
        {
          title: "Financial Reports",
          url: `/${organizationId}/dashboard/${userId}/reports/financial-report`,
          icon: Calculator,
          roleField: "studentReport",
        },
        {
          title: "Trial Balance",
          url: `/${organizationId}/dashboard/${userId}/reports/trial-balance`,
          icon: BarChart3,
          roleField: "studentReport",
        },
        {
          title: "Student Analytics",
          url: `/${organizationId}/dashboard/${userId}/reports/student-report`,
          icon: Users,
          roleField: "studentReport",
        },
        {
          title: "Revenue Reports",
          url: `/${organizationId}/dashboard/${userId}/reports/register-report`,
          icon: DollarSign,
        },
        {
          title: "Attendance Analytics",
          url: `/${organizationId}/dashboard/${userId}/reports/expenses-report`,
          icon: UserCheck,
        },
        {
          title: "HR Analytics",
          url: `/${organizationId}/dashboard/${userId}/reports/product-sell-report`,
          icon: UsersRound,
        },
        {
          title: "Inventory Reports",
          url: `/${organizationId}/dashboard/${userId}/reports/product-purchase-report`,
          icon: Package,
        },
        {
          title: "Academic Performance",
          url: `/${organizationId}/dashboard/${userId}/reports/sell-return-report`,
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Activity History",
      url: `/${organizationId}/dashboard/${userId}/history`,
      icon: History,
      description: "System activity logs",
    },
    {
      title: "Recycle Bin",
      url: `/${organizationId}/dashboard/${userId}/trash`,
      icon: Trash2,
      description: "Deleted items recovery",
    },
  ]

  const isActive = useCallback(
    (url: string) => {
      const dashboardPath = `/${organizationId}/dashboard/${userId}`
      if (pathname === dashboardPath || pathname === `${dashboardPath}/`) {
        return url === pathname
      }
      return pathname.startsWith(url) && url !== dashboardPath
    },
    [pathname, organizationId, userId],
  )

  // Memoize filtered navigation items for better performance
  const filteredNavMain = useMemo(() => {
    return navMain
      .filter((item): item is NavItem => item !== false)
      .filter((item) => !item.roleField || (role && role[item.roleField as keyof IRole]))
      .filter((item) => {
        if (!searchQuery) return true
        const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDescription = item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubItems = item.items?.some((subItem) =>
          subItem.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        return matchesTitle || matchesDescription || matchesSubItems
      })
  }, [role, searchQuery])

  // Handle accordion behavior - only one section open at a time
  const handleGroupToggle = useCallback((groupTitle: string) => {
    setOpenGroup((prev) => {
      // If clicking the same group, close it
      if (prev === groupTitle) {
        return null
      }
      // Otherwise, open the new group (this automatically closes others)
      return groupTitle
    })
  }, [])

  // Automatically open collapsible if an item inside is active (only on initial load)
  useEffect(() => {
    // Only set initial state if no group is currently open
    if (openGroup === null) {
      const activeGroup = filteredNavMain.find((group) => group.items?.some((item) => isActive(item.url)))
      if (activeGroup) {
        setOpenGroup(activeGroup.title)
      }
    }
  }, [pathname, filteredNavMain, isActive, openGroup])

  // Clear search when component unmounts or path changes significantly
  useEffect(() => {
    setSearchQuery("")
  }, [organizationId, userId])

  // Render dropdown menu for collapsed sidebar
  const renderDropdownMenu = (item: NavItem) => {
    const filteredSubItems = item.items?.filter(
      (subItem) => !subItem?.roleField || (role && role[subItem?.roleField as keyof IRole]),
    )

    if (!filteredSubItems || filteredSubItems.length === 0) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.description || item.title}
            className={cn(
              "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
              item.items?.some((subItem) => isActive(subItem.url)) &&
              "bg-primary/10 text-primary font-medium border-l-2 border-primary",
              "h-10 px-3 w-full justify-center",
            )}
          >
            {item.icon && (
              <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", item.isPro && "text-amber-500")} />
            )}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-48">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b mb-1">{item.title}</div>
          {filteredSubItems.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <Link
                href={subItem.url}
                className={cn(
                  "flex items-center gap-3 px-2 py-1.5 text-sm cursor-pointer",
                  isActive(subItem.url) && "bg-primary/10 text-primary font-medium",
                )}
              >
                {subItem.icon && <subItem.icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="flex-1">{subItem.title}</span>
                {subItem.badge && (
                  <Badge variant={subItem.badgeVariant || "secondary"} className="text-xs px-1.5 py-0 h-4 min-w-4">
                    {subItem.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <SidebarGroup className="scrollbar-hide">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Navigation
      </SidebarGroupLabel>

      {/* Search Input - only show when expanded */}
      {!isCollapsed && (
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
            />
          </div>
        </div>
      )}

      <SidebarMenu className="space-y-1">
        {filteredNavMain.map((item) =>
          item.items ? (
            isCollapsed ? (
              // Render dropdown when collapsed
              <SidebarMenuItem key={item.title}>{renderDropdownMenu(item)}</SidebarMenuItem>
            ) : (
              // Render collapsible when expanded
              <Collapsible
                key={item.title}
                open={openGroup === item.title}
                onOpenChange={() => handleGroupToggle(item.title)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.description || item.title}
                      className={cn(
                        "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                        "data-[state=open]:bg-accent/30 data-[state=open]:text-accent-foreground",
                        item.items?.some((subItem) => isActive(subItem.url)) &&
                        "bg-primary/10 text-primary font-medium border-l-2 border-primary",
                        openGroup === item.title && "bg-accent/30 text-accent-foreground",
                        "h-10 px-3 w-full justify-start",
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {item.icon && (
                          <item.icon
                            className={cn("h-4 w-4 shrink-0 transition-colors", item.isPro && "text-amber-500")}
                          />
                        )}
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">{item.title}</span>
                            {item.isPro && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0 h-4 bg-amber-100 text-amber-700"
                              >
                                PRO
                              </Badge>
                            )}
                            {item.isNew && (
                              <Badge variant="default" className="text-xs px-1.5 py-0 h-4 bg-green-100 text-green-700">
                                NEW
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <Badge variant={item.badgeVariant || "secondary"} className="text-xs px-1.5 py-0 h-4 min-w-4">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            openGroup === item.title && "rotate-90",
                          )}
                        />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                    <SidebarMenuSub className="ml-4 border-l border-border/50 pl-4 space-y-1 mt-1">
                      {item.items
                        ?.filter((subItem) => !subItem?.roleField || (role && role[subItem?.roleField as keyof IRole]))
                        .map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                                isActive(subItem.url) &&
                                "bg-primary/10 text-primary font-medium border-l-2 border-primary ml-[-1px]",
                                "h-9 px-3",
                              )}
                            >
                              <Link href={subItem.url}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {subItem.icon && <subItem.icon className="h-3.5 w-3.5 shrink-0" />}
                                  <span className="truncate text-sm">{subItem.title}</span>
                                </div>
                                {subItem.badge && (
                                  <Badge
                                    variant={subItem.badgeVariant || "secondary"}
                                    className="text-xs px-1.5 py-0 h-4 min-w-4 ml-auto"
                                  >
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.description || item.title}
                className={cn(
                  "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                  isActive(item.url) && "bg-primary text-primary-foreground font-medium shadow-sm",
                  "h-10 px-3",
                  isCollapsed && "justify-center",
                )}
              >
                <Link href={item.url}>
                  <div className={cn("flex items-center gap-3 flex-1 min-w-0", isCollapsed && "justify-center")}>
                    {item.icon && (
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", item.isPro && "text-amber-500")} />
                    )}
                    {!isCollapsed && (
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{item.title}</span>
                          {item.isPro && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4 bg-amber-100 text-amber-700">
                              PRO
                            </Badge>
                          )}
                          {item.isNew && (
                            <Badge variant="default" className="text-xs px-1.5 py-0 h-4 bg-green-100 text-green-700">
                              NEW
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {!isCollapsed && item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="text-xs px-1.5 py-0 h-4 min-w-4 ml-auto"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}