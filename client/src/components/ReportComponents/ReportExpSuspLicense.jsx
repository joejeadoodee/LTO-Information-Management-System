function ReportExpSuspLicense() {
  return (
    <div className="bg-white flex flex-col p-5 h-70 justify-between">
      <div>
        <h3 className="font-bold text-2xl mb-5 text-[#293747]">
          Expired and Suspended Licenses
        </h3>
      </div>
      <button className="button-behave bg-[#3F5F92]">Generate Report</button>
    </div>
  );
}

export default ReportExpSuspLicense;
