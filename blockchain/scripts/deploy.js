import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying BhoomiReportRegistry...");

  const ReportRegistry = await hre.ethers.getContractFactory(
    "BhoomiReportRegistry"
  );

  const reportRegistry = await ReportRegistry.deploy();

  await reportRegistry.waitForDeployment();

  const contractAddress = await reportRegistry.getAddress();

  console.log("====================================");
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Address:", contractAddress);
  console.log("====================================");
}

main().catch((error) => {
  console.error("❌ Deployment failed");
  console.error(error);
  process.exitCode = 1;
});