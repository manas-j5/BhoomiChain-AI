// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BhoomiReportRegistry {

    struct Report {
        string reportId;
        string datasetHash;
        string datasetVersion;
        string source;
        uint256 timestamp;
        address creatorWallet;
    }

    mapping(string => Report) private reports;
    mapping(string => bool) private reportRegistered;

    event ReportRegistered(
        string indexed reportId,
        string datasetHash,
        string datasetVersion,
        address indexed creatorWallet,
        uint256 timestamp
    );

    error ReportAlreadyExists(string reportId);
    error ReportNotFound(string reportId);

    function registerReport(
        string calldata reportId,
        string calldata datasetHash,
        string calldata datasetVersion,
        string calldata source
    ) external {

        if (reportRegistered[reportId]) {
            revert ReportAlreadyExists(reportId);
        }

        reports[reportId] = Report({
            reportId: reportId,
            datasetHash: datasetHash,
            datasetVersion: datasetVersion,
            source: source,
            timestamp: block.timestamp,
            creatorWallet: msg.sender
        });

        reportRegistered[reportId] = true;

        emit ReportRegistered(
            reportId,
            datasetHash,
            datasetVersion,
            msg.sender,
            block.timestamp
        );
    }

    function reportExists(
        string calldata reportId
    ) external view returns (bool) {
        return reportRegistered[reportId];
    }

    function getReportHash(
        string calldata reportId
    ) external view returns (string memory) {

        if (!reportRegistered[reportId]) {
            revert ReportNotFound(reportId);
        }

        return reports[reportId].datasetHash;
    }

    function verifyReport(
        string calldata reportId,
        string calldata datasetHash
    ) external view returns (bool) {

        if (!reportRegistered[reportId]) {
            return false;
        }

        return (
            keccak256(bytes(reports[reportId].datasetHash)) ==
            keccak256(bytes(datasetHash))
        );
    }

    function getReport(
        string calldata reportId
    ) external view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        address
    ) {

        if (!reportRegistered[reportId]) {
            revert ReportNotFound(reportId);
        }

        Report memory report = reports[reportId];

        return (
            report.reportId,
            report.datasetHash,
            report.datasetVersion,
            report.source,
            report.timestamp,
            report.creatorWallet
        );
    }
}