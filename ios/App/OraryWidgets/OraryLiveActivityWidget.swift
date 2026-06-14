// OraryLiveActivityWidget.swift
// The Dynamic Island + Lock Screen UI for Live Mode.
// Add this file to the OraryWidgets target ONLY.
//
// Lock Screen: gradient background with theme color, Orary logo, status badge,
//              large timer, earnings — mirrors the dashboard LiveModeCard.
// Dynamic Island compact/minimal: work color avatar (space-constrained).
//
// ⚠️ XCODE SETUP: Add "OraryLogo" image to OraryWidgets/Assets.xcassets.
//    Use a white/transparent PNG so it renders correctly over the gradient.

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

// MARK: - Work Avatar (compact/minimal only)

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

private func adjustedStartDate(
    sessionStart: Date,
    totalPausedSeconds: Int,
    isPaused: Bool
) -> Date? {
    guard !isPaused else { return nil }
    return sessionStart.addingTimeInterval(TimeInterval(totalPausedSeconds))
}

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

// MARK: - Lock Screen / Notification Banner

struct OraryLockScreenView: View {
    let context: ActivityViewContext<OraryLiveActivityAttributes>

    private var themeColor: Color {
        Color(hex: context.attributes.themeColor) ?? Color(hex: "#EC4899") ?? .pink
    }

    var body: some View {
        ZStack {
            // Gradient background mirroring LiveModeCard
            LinearGradient(
                colors: [
                    themeColor.opacity(0.75),
                    themeColor,
                    themeColor.opacity(0.9)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            HStack(spacing: 16) {
                // Left: logo + work name + status badge
                VStack(alignment: .leading, spacing: 5) {
                    // Status badge (pill like the dashboard card)
                    HStack(spacing: 5) {
                        Circle()
                            .fill(context.state.isPaused ? Color.yellow : Color.red)
                            .frame(width: 6, height: 6)
                            .shadow(color: context.state.isPaused ? .yellow : .red, radius: 2)
                        Text(context.state.isPaused ? "PAUSED" : "LIVE")
                            .font(.system(size: 9, weight: .black))
                            .foregroundColor(.white)
                            .kerning(0.8)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.white.opacity(0.2))
                    .clipShape(Capsule())

                    // Logo + work name
                    HStack(spacing: 6) {
                        Image("OraryLogo")
                            .resizable()
                            .renderingMode(.template)
                            .foregroundColor(.white)
                            .frame(width: 18, height: 18)
                            .opacity(0.95)

                        Text(context.attributes.workName)
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.white.opacity(0.9))
                            .lineLimit(1)
                    }
                }

                Spacer()

                // Right: timer + earnings
                VStack(alignment: .trailing, spacing: 4) {
                    timerView
                        .font(.system(.title3, design: .monospaced).bold())
                        .foregroundColor(.white)

                    HStack(spacing: 3) {
                        Image(systemName: "dollarsign")
                            .font(.system(size: 10, weight: .semibold))
                        Text(context.state.earningsFormatted.replacingOccurrences(of: "$", with: ""))
                            .font(.caption.bold())
                    }
                    .foregroundColor(.white.opacity(0.85))
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
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
        }
    }
}

// MARK: - Dynamic Island Widget

struct OraryLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: OraryLiveActivityAttributes.self) { context in
            OraryLockScreenView(context: context)

        } dynamicIsland: { context in
            DynamicIsland {

                // ── Expanded ──────────────────────────────────────────────
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
                // ── Compact right: timer ──────────────────────────────────
                compactTimerView(context: context)
                    .font(.caption.monospacedDigit().bold())
                    .foregroundColor(context.state.isPaused ? .yellow : .red)

            } minimal: {
                // ── Minimal: single dot on island edge ────────────────────
                WorkAvatar(
                    initial: context.attributes.workInitial,
                    colorHex: context.attributes.workColor,
                    size: 16
                )
            }
        }
    }

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
