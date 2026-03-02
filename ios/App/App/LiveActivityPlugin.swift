// LiveActivityPlugin.swift
// Capacitor bridge to start/update/end iOS Live Activities from JavaScript.
// Add this file to the App target only.

import Foundation
import Capacitor
import ActivityKit

@objc(LiveActivityPlugin)
public class LiveActivityPlugin: CAPPlugin {

    private var currentActivityId: String?

    // MARK: - isSupported

    @objc func isSupported(_ call: CAPPluginCall) {
        if #available(iOS 16.2, *) {
            let supported = ActivityAuthorizationInfo().areActivitiesEnabled
            call.resolve(["supported": supported])
        } else {
            call.resolve(["supported": false])
        }
    }

    // MARK: - startActivity

    @objc func startActivity(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve(["activityId": ""])
            return
        }

        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            call.resolve(["activityId": ""])
            return
        }

        let workName = call.getString("workName") ?? "Live Shift"
        let workColor = call.getString("workColor") ?? "#EC4899"
        let workInitial = String(workName.prefix(1)).uppercased()
        let startDateStr = call.getString("sessionStartDate") ?? ""

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let sessionStartDate = formatter.date(from: startDateStr) ?? Date()

        let attributes = OraryLiveActivityAttributes(
            workName: workName,
            workColor: workColor,
            workInitial: workInitial,
            sessionStartDate: sessionStartDate
        )

        let initialState = OraryLiveActivityAttributes.ContentState(
            totalPausedSeconds: 0,
            pausedSince: nil,
            earningsFormatted: "$0.00",
            isPaused: false
        )

        do {
            // End any stale activity first
            endCurrentActivitySync()

            let activity = try Activity<OraryLiveActivityAttributes>.request(
                attributes: attributes,
                content: .init(state: initialState, staleDate: Date().addingTimeInterval(86400))
            )
            currentActivityId = activity.id
            call.resolve(["activityId": activity.id])
        } catch {
            // Live activity is non-critical — don't fail the call
            call.resolve(["activityId": ""])
        }
    }

    // MARK: - updateActivity

    @objc func updateActivity(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *), let activityId = currentActivityId else {
            call.resolve()
            return
        }

        let totalPausedSeconds = call.getInt("totalPausedSeconds") ?? 0
        let earningsFormatted = call.getString("earningsFormatted") ?? "$0.00"
        let isPaused = call.getBool("isPaused") ?? false

        var pausedSince: Date? = nil
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let pausedSinceStr = call.getString("pausedSince"), !pausedSinceStr.isEmpty {
            pausedSince = formatter.date(from: pausedSinceStr)
        }

        let newState = OraryLiveActivityAttributes.ContentState(
            totalPausedSeconds: totalPausedSeconds,
            pausedSince: pausedSince,
            earningsFormatted: earningsFormatted,
            isPaused: isPaused
        )

        Task {
            for activity in Activity<OraryLiveActivityAttributes>.activities
            where activity.id == activityId {
                await activity.update(
                    ActivityContent(state: newState, staleDate: Date().addingTimeInterval(3600))
                )
            }
        }
        call.resolve()
    }

    // MARK: - endActivity

    @objc func endActivity(_ call: CAPPluginCall) {
        if #available(iOS 16.2, *) {
            endCurrentActivitySync()
        }
        currentActivityId = nil
        call.resolve()
    }

    // MARK: - Private helpers

    @available(iOS 16.2, *)
    private func endCurrentActivitySync() {
        guard let activityId = currentActivityId else { return }
        Task {
            for activity in Activity<OraryLiveActivityAttributes>.activities
            where activity.id == activityId {
                await activity.end(dismissalPolicy: .immediate)
            }
        }
    }
}
