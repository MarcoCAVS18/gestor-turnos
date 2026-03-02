// OraryLiveActivityWidget.swift
// The Dynamic Island + Lock Screen UI for Live Mode.
// Add this file to the OraryWidgets target ONLY.
//
// Design:
//   Compact leading:  Work avatar circle with initial
//   Compact trailing: Timer (auto-updates every second via Date.style.timer)
//   Minimal:          Work avatar dot
//   Expanded:         Avatar + Name + full timer + earnings

import ActivityKit
import SwiftUI
import WidgetKit

// MARK: - Color helper

extension Color {
    init?(hex: String) {
        let h = hex.trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")
        guard h.count == 6 else { return nil }
        var rgb: UInt64 = 0
        guard Scanner(string: h).scanHexInt64(&rgb) else { return nil }
        self.init(
            red:   Double((rgb >> 16) & 0xFF) / 255.0,
            green: Double((rgb >> 8)  & 0xFF) / 255.0,
            blue:  Double( rgb        & 0xFF) / 255.0
        )
    }
}

// MARK: - Work Avatar

struct WorkAvatar: View {
    let initial: String
    let colorHex: String
    let size: CGFloat

    private var bg: Color { Color(hex: colorHex) ?? .pink }

    var body: some View {
        Circle()
            .fill(bg)
            .frame(width: size, height: size)
            .overlay(
                Text(initial)
                    .font(.system(size: size * 0.42, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            )
    }
}

// MARK: - Timer helpers

/// Returns the "adjusted start" date that SwiftUI's .timer style should count from,
/// factoring in accumulated pauses. When paused, returns nil.
private func adjustedStartDate(
    sessionStart: Date,
    totalPausedSeconds: Int,
    pausedSince: Date?,
    isPaused: Bool
) -> Date? {
    guard !isPaused else { return nil }
    return sessionStart.addingTimeInterval(TimeInterval(totalPausedSeconds))
}

/// Elapsed time at the moment of pause (to show as a frozen string)
private func frozenElapsedSeconds(
    sessionStart: Date,
    totalPausedSeconds: Int,
    pausedSince: Date
) -> Int {
    let elapsed = Int(pausedSince.timeIntervalSince(sessionStart)) - totalPausedSeconds
    return max(0, elapsed)
}

private func formatSeconds(_ s: Int) -> String {
    let h = s / 3600
    let m = (s % 3600) / 60
    let sec = s % 60
    return String(format: "%02d:%02d:%02d", h, m, sec)
}

private func formatSecondsShort(_ s: Int) -> String {
    let h = s / 3600
    let m = (s % 3600) / 60
    if h > 0 { return String(format: "%dh%02dm", h, m) }
    return String(format: "%02dm", m)
}

// MARK: - Lock Screen / Notification Banner view

struct OraryLockScreenView: View {
    let context: ActivityViewContext<OraryLiveActivityAttributes>

    var body: some View {
        HStack(spacing: 14) {
            WorkAvatar(
                initial: context.attributes.workInitial,
                colorHex: context.attributes.workColor,
                size: 44
            )

            VStack(alignment: .leading, spacing: 2) {
                Text(context.attributes.workName)
                    .font(.headline)
                    .foregroundColor(.primary)
                Text(context.state.isPaused ? "Paused" : "Live Mode Active")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                // Timer — auto-updates when active, frozen when paused
                timerView
                    .font(.system(.title3, design: .monospaced).bold())

                Text(context.state.earningsFormatted)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }

    @ViewBuilder
    private var timerView: some View {
        if context.state.isPaused, let pausedAt = context.state.pausedSince {
            Text(formatSeconds(frozenElapsedSeconds(
                sessionStart: context.attributes.sessionStartDate,
                totalPausedSeconds: context.state.totalPausedSeconds,
                pausedSince: pausedAt
            )))
            .foregroundColor(.yellow)
        } else {
            Text(
                context.attributes.sessionStartDate
                    .addingTimeInterval(TimeInterval(context.state.totalPausedSeconds)),
                style: .timer
            )
            .foregroundColor(.red)
        }
    }
}

// MARK: - Dynamic Island Widget

struct OraryLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: OraryLiveActivityAttributes.self) { context in
            // Lock Screen / Notification banner
            OraryLockScreenView(context: context)
                .background(.background)

        } dynamicIsland: { context in
            DynamicIsland {

                // ── Expanded (user long-presses) ──────────────────────────
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 8) {
                        WorkAvatar(
                            initial: context.attributes.workInitial,
                            colorHex: context.attributes.workColor,
                            size: 34
                        )
                        VStack(alignment: .leading, spacing: 1) {
                            Text(context.attributes.workName)
                                .font(.caption.bold())
                                .foregroundColor(.white)
                                .lineLimit(1)
                            Text(context.state.isPaused ? "Paused" : "Live")
                                .font(.caption2)
                                .foregroundColor(context.state.isPaused ? .yellow : Color(hex: "#FF6B6B") ?? .red)
                        }
                    }
                    .padding(.leading, 4)
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.earningsFormatted)
                        .font(.title3.monospacedDigit().bold())
                        .foregroundColor(.white)
                        .padding(.trailing, 4)
                }

                DynamicIslandExpandedRegion(.bottom) {
                    HStack(spacing: 8) {
                        Circle()
                            .fill(context.state.isPaused ? Color.yellow : Color.red)
                            .frame(width: 8, height: 8)

                        expandedTimerView(context: context)
                            .font(.title2.monospacedDigit().bold())
                            .foregroundColor(.white)

                        Spacer()
                    }
                    .padding(.horizontal, 8)
                    .padding(.bottom, 4)
                }

            } compactLeading: {
                // ── Compact left: work avatar ─────────────────────────────
                WorkAvatar(
                    initial: context.attributes.workInitial,
                    colorHex: context.attributes.workColor,
                    size: 22
                )

            } compactTrailing: {
                // ── Compact right: timer (auto-updating) ──────────────────
                compactTimerView(context: context)
                    .font(.caption.monospacedDigit().bold())
                    .foregroundColor(context.state.isPaused ? .yellow : .red)

            } minimal: {
                // ── Minimal (single dot on island edge) ───────────────────
                WorkAvatar(
                    initial: context.attributes.workInitial,
                    colorHex: context.attributes.workColor,
                    size: 16
                )
            }
        }
    }

    // Auto-updating timer for expanded view
    @ViewBuilder
    private func expandedTimerView(context: ActivityViewContext<OraryLiveActivityAttributes>) -> some View {
        if context.state.isPaused, let pausedAt = context.state.pausedSince {
            Text(formatSeconds(frozenElapsedSeconds(
                sessionStart: context.attributes.sessionStartDate,
                totalPausedSeconds: context.state.totalPausedSeconds,
                pausedSince: pausedAt
            )))
        } else {
            Text(
                context.attributes.sessionStartDate
                    .addingTimeInterval(TimeInterval(context.state.totalPausedSeconds)),
                style: .timer
            )
        }
    }

    // Compact trailing timer (HH:MM or MMm)
    @ViewBuilder
    private func compactTimerView(context: ActivityViewContext<OraryLiveActivityAttributes>) -> some View {
        if context.state.isPaused, let pausedAt = context.state.pausedSince {
            Text(formatSecondsShort(frozenElapsedSeconds(
                sessionStart: context.attributes.sessionStartDate,
                totalPausedSeconds: context.state.totalPausedSeconds,
                pausedSince: pausedAt
            )))
        } else {
            Text(
                context.attributes.sessionStartDate
                    .addingTimeInterval(TimeInterval(context.state.totalPausedSeconds)),
                style: .timer
            )
        }
    }
}
