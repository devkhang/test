// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/dashboard";
// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  meritorious: {
    user: path(ROOTS_DASHBOARD, "/user"),
    records: path(ROOTS_DASHBOARD, "/records-management"),
    monthlyPayment: path(ROOTS_DASHBOARD, "/monthly-payment"),
    implementationList: path(ROOTS_DASHBOARD, "/implementation-list"),
    statisticReport: path(ROOTS_DASHBOARD, "/statistic-report"),
    preferentialTreament: path(ROOTS_DASHBOARD, "/preferentialTreament"),
    burialFee: path(ROOTS_DASHBOARD, "/burial-fee"),
  },
  /**
   * 1 là sở
   * 2 là phòng
   * */
  app: {
    root: path(ROOTS_DASHBOARD, "/app"),
    pageFour: path(ROOTS_DASHBOARD, "/app/four"),
    pageFive: path(ROOTS_DASHBOARD, "/app/five"),
    pageSix: path(ROOTS_DASHBOARD, "/app/six"),
  },
};
