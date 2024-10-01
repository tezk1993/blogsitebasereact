import React from 'react'

export const Footer = () => {
  return (
    <footer class="bg-white mb-auto  shadow  dark:bg-gray-800  w-full ">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="{{< param homepage >}}/" class="hover:underline">Dennis Schau Andersen</a>. All Rights Reserved.
            </span>
            <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0 list-none">
                <li>
                    <a href="#" class="hover:underline m-4 md:m-6">About</a>
                </li>
                <li>
                    <a href="#" class="hover:underline m-4 md:m-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" class="hover:underline m-4 md:m-6">Licensing</a>
                </li>
                <li>
                    <a href="#" class="hover:underline">Contact</a>
                </li>
            </ul>
        </div>
    </footer>
  )
}
