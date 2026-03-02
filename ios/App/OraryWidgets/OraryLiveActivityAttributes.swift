// OraryLiveActivityAttributes.swift
// ⚠️ IMPORTANT: This file must be added to BOTH the App target AND the OraryWidgets target in Xcode.
// File → Target Membership → check both boxes.

import ActivityKit
import Foundation

struct OraryLiveActivityAttributes: ActivityAttributes {

    // Immutable: set once when the activity starts
    var workName: String
    var workColor: String    // hex e.g. "#EC4899"
    var workInitial: String  // first letter of work name e.g. "J"
    var sessionStartDate: Date

    // Mutable: updated while session is running
    public struct ContentState: Codable, Hashable {
        // Total pause duration accumulated BEFORE any current pause (in seconds)
        var totalPausedSeconds: Int
        // If currently paused, the timestamp when the current pause started (else nil)
        var pausedSince: Date?
        // Earnings display string e.g. "$12.50"
        var earningsFormatted: String
        var isPaused: Bool
    }
}
