import Heading from '@/components/commons/Header';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

import { currentUserRole } from '@/lib/helpers/get-user-role';
import { DataTable } from '@/components/table/data-table';
import { currentUser } from '@/lib/helpers/session';
import { getAllTeams } from '@/lib/actions/team.action';
import { TeamModal } from './_components/TeamModal';
import { columns } from './_components/column';

const page = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  const role = await currentUserRole();

   const data = await getAllTeams() || []
    
  console.log("departments data", data)
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Manage Teams" description="Manage,create and edit Hub teams" />
        <TeamModal />
      </div>
      <Separator />
      <div className="">
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </>
  )
}

export default page