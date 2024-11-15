"use client"
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { Icons } from '@/app/components/ui/icons'
import Link from 'next/link'
import React from 'react'
import images from '@/public/images'
import { usePathname } from 'next/navigation'
import CustomImage from '@/app/components/ui/image'

const Sidebar = () => {
    const sidebar = [
        {
            icon: <Icons.DashboardIcon />,
            title: 'Dashboard',
            paths: [ApplicationRoutes.Dashboard],
        },
    ]

    const pathname = usePathname();

    return (
        <aside className='bg-[#0A0A0A] rounded-xl overflow-hidden w-[20%]'>
            <div className='h-[calc(100vh_-_16px)] min-w-fit py-8 px-6 flex flex-col overflow-y-auto overflow-x-hidden thinScrollbar'>
                <div className='mb-16 mt-3 min-w-24 min-h-12 relative'>
                    <CustomImage src={images.logo} alt='Logo' className='object-contain' />
                </div>
                <ul className='flex flex-col gap-6 mb-32 w-fit'>
                    {
                        sidebar.map((navLink) => {

                            const isActiveLink = pathname == navLink.paths[0] || navLink.paths.includes(pathname);

                            return (
                                <li
                                    key={navLink.title}
                                    className={`flex items-center justify-between text-white opacity-70 hover:opacity-100 ${isActiveLink ? "!opacity-100" : ""}`}>
                                    <Link
                                        href={navLink.paths[0]}
                                        className={`flex items-center gap-4 px-2 ${isActiveLink ? "bg-primary text-white font-normal p-2  pr-4 rounded-xl w-[170px]" : "bg-transparent"} `}>
                                        {navLink.icon}
                                        <span> {navLink.title}</span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
