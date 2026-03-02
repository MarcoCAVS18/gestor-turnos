// OraryWidgetBundle.swift
// Entry point for the OraryWidgets extension.
// Add this file to the OraryWidgets target ONLY.

import SwiftUI
import WidgetKit

@main
struct OraryWidgetBundle: WidgetBundle {
    var body: some Widget {
        OraryLiveActivityWidget()
    }
}
