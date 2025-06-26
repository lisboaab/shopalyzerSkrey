![Generic badge](https://img.shields.io/badge/Status-In_Progress-blue)

<div align="center">
<img src="https://res.cloudinary.com/ditdnslga/image/upload/v1748943689/logo_shopalyzer_f9ze8y.png" width="40%" />
</div>

<hr>

## About the project:

Shopalyzer was developed during a curricular internship @Skrey Software. 
The main goal of the app is to make it easier to analyse metrics of multiple Shopify Stores developed by Skrey.

<hr>

## Developed by:

<table align="center">
    <tr>
        <td align="center">
        <img style="border-radius: 50%; width="100px;"" src="https://avatars.githubusercontent.com/u/99557581?v=4" width="100px;"><br>
        <sub>
        <b>Beatriz Lisboa</br>
        </td>
    </tr>
</table>

<hr>

## Main tech stack:

![React](https://shields.io/badge/React-3178C6?logo=React&logoColor=FFF&style=for-the-badge)
![Next.js](https://shields.io/badge/Next.js-3178C6?logo=nextdorjs&logoColor=FFF&style=for-the-badge)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)
![GraphQL](https://shields.io/badge/GraphQL-3178C6?logo=GraphQL&logoColor=FFF&style=for-the-badge)

<hr>

## Getting Started

Don't forget to install all the dependecies with the command:

```bash
npm install
```

First, run the development ambient:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, run the server:

```bash
nodemon server
# or
node server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<hr>

## Run tests (Vitest)
```bash
npm run test
```

<hr>

## Metrics suported by the app
1. <b>Average Order Value:</b> Calculates the average amount spent by a customer on each order.
2. <b>Conversion Rate:</b> Measures the percentage of visitors who made a purchase in the store.
3. <b>Total Revenue:</b> Sum of all amounts obtained through sales.
4. <b>Total Discount:</b> Total discounts applied to sales.
5. <b>Total Tax by Region:</b> Calculates the total amount of taxes charged, broken down by city.
6. <b>Top 5 Products:</b> Displays the five best-selling products.
7. <b>Top 5 Categories:</b> Displays the five most popular sales categories.
8. <b>Total Orders:</b> Calculates the total number of successfully placed orders.
9. <b>Conversion Rate Over Time:</b> Conversion Rate Trend Over Time
10. <b>Orders by Location:</b> Indicates the cities with the most sales.
11. <b>Average Shipping Cost:</b> Calculates the average shipping cost of all placed orders.
12. <b>Average Products per Order:</b> Indicates the average number of products in each order.
13. <b>Total Refunds:</b> Measures the total amount refunded to customers.
14. <b>Refund Rate:</b> Indicates the percentage of orders that were fully or partially refunded.
15. <b>Return Rate:</b> Percentage of orders with partial or total returns.
16. <b>Orders Over Time:</b> Displays the number of sales per period within a given time frame.

<hr>

## Please notice
- When rendering the server it checks if the app already has an admin user, if the metrics are added to the database and if the "Custom" metrics group exists. If they don't exist the server created them, since these are all required items for the app to successfully run.
- Admin user data:
  Email: admin@gmail.com
  Password: 123

<hr>

## Environment variables
1. uri: MONGODB URI to connect with the BD
2. 
