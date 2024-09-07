# Next.js & NextUI Template

This is a template for creating applications using Next.js 13 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

**Purpose:**  
The Parking Lot Management System is designed to streamline the process of parking vehicles, tracking their status, and integrating vehicle repair and maintenance workflows. It offers a complete solution from vehicle check-in, service tracking, to customer notification and vehicle retrieval.

---

#### Key Features:

1. **Vehicle Check-In and Parking Management:**
   - Track the entry and exit of all vehicles.
   - Assign parking spaces dynamically based on availability.
   - Record essential vehicle details (license plate, model, owner information).
   - Track vehicle location within the lot in real-time.

2. **Workshop Integration:**
   - After parking, vehicles can be routed directly to an integrated workshop for repair or maintenance services.
   - Service orders can be generated based on reported issues or routine checks.

3. **Real-Time Vehicle Status Tracking:**
   - Workers and mechanics can update the status of each vehicle throughout the service process.
     - Example statuses: "In Queue", "Under Inspection", "Repair in Progress", "Waiting for Parts", "Ready for Pickup".
   - Managers and staff can monitor the progress in real-time via dashboards and logs.

4. **Approval and Completion Workflow:**
   - Once a vehicle’s service is complete, a designated supervisor or manager must approve the work.
   - Approval triggers an automated notification to the vehicle owner, indicating that the vehicle is ready for pickup.

5. **Automated Client Notification:**
   - Upon approval, the system contacts the client through their preferred method (SMS, email, app notification) to inform them that their vehicle is ready for collection.
   - Clients can confirm pickup times or request additional services directly through the system.

6. **Service History and Reporting:**
   - Maintain a comprehensive history of each vehicle’s parking and service records.
   - Generate detailed reports on vehicle status, service completion times, and parking lot utilization.

7. **User Roles and Permissions:**
   - Different user roles (e.g., parking attendants, workshop mechanics, managers) with tailored permissions.
   - Workers can update statuses, mechanics can add service details, and managers can approve completed jobs.

8. **Mobile and Web Interface:**
   - Accessible on both mobile devices and desktops, allowing for seamless tracking and updates by all stakeholders, including clients.
   - Customers can track their vehicle's status and expected service completion through a client portal.

## How to Use

## Access this link https://park-vert.vercel.app and use the next credentials: Username:123 Password:qweqwe

Or

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
