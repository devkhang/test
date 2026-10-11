const sumMoney = (array: any) => {
  return array.reduce((sum: any, item: any) => {
    sum.sumSubsidy = (+sum?.sumSubsidy || 0) + (+item?.subsidy || 0);
    sum.sumAllowance = (+sum?.sumAllowance || 0) + (+item?.allowance || 0);
    sum.month3 =
      (+sum.month3 || 0) +
      ((+item?.subsidy || 0) + (+item?.allowance || 0)) * 3;
    sum.sumSubsidies =
      (+sum.sumSubsidies || 0) +
      (+item?.subsidy || 0) +
      (+item?.allowance || 0);
    if (item.beneficiary === 1 && item.subsidyForm === 1) {
      sum.deadMoney =
        (+sum?.deadMoney || 0) +
        (+item?.subsidy || 0) +
        (+item?.allowance || 0);
    }
    return sum;
  }, {});
};

const showDetailReducer = ({ action, props }: any) => {
  const { row } = props;

  const cases: any = {
    initial: () => {
      const res: any = {};
      const profiles = row?.profiles;
      const beneficiaries = profiles?.infoBeneficiary[0];

      res.recordInfo = {
        code: profiles?.code || "",
        fullName: profiles?.fullName || "",
        dateOfBirth: profiles?.dateOfBirth || "",
        gender: profiles?.gender,
        dead: beneficiaries?.dateOfNccDeath || profiles?.infoNcc[0]?.dead || "",
        province: profiles?.province || null,
        district: profiles?.district || null,
        ward: profiles?.ward || null,
        nativePlace: profiles?.nativePlace || "",
        address: profiles?.address || "",
      };
      res.inforReceiver = {
        fullName: beneficiaries?.fullName || "",
        dateOfBirth: beneficiaries?.dateOfBirth || "",
        gender: beneficiaries?.gender,
        relation: beneficiaries?.relation || "",
        nativePlace: beneficiaries?.nativePlace || "",
        district: beneficiaries?.district || null,
        ward: beneficiaries?.ward || null,
      };

      const sum = sumMoney(profiles?.prefers || []);

      res.inforBurialFee = {
        ...sum,
        decided: row.decided || "",
        decidedDate: row.decidedDate || "",
        decidedPerson: row.decidedPerson || "",
        fee: row.fee || "",
        type: row.type,
        stopDate: row.stopDate || "",
        startDate: row.startDate || "",
      };

      return { ...res, loading: false };
    },
  };
  return cases[action.type] && cases[action.type]();
};
export default showDetailReducer;
