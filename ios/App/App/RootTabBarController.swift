import UIKit

final class RootTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        applyTabBarAppearance()
        viewControllers = [
            wrap(HomeViewController(), title: "主页", systemImage: "house"),
            wrap(LegacyWebViewController(initialView: "interval"), title: "音程", systemImage: "waveform.path.ecg"),
            wrap(LegacyWebViewController(initialView: "chord"), title: "和弦", systemImage: "square.stack.3d.up"),
            wrap(LegacyWebViewController(initialView: "guitar"), title: "吉他", systemImage: "guitars"),
            wrap(ScanViewController(), title: "识谱", systemImage: "doc.viewfinder")
        ]
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        applyTabBarAppearance()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // Force window tint to app orange (prevents system red tint on some devices).
        view.window?.tintColor = .appOrange
        applyTabBarAppearance()
    }


    private func wrap(_ controller: UIViewController, title: String, systemImage: String) -> UIViewController {
        controller.title = title
        let nav = UINavigationController(rootViewController: controller)
        let image = UIImage(systemName: systemImage)?.withRenderingMode(.alwaysTemplate)
        let selectedImage = UIImage(systemName: systemImage)?.withRenderingMode(.alwaysOriginal)
        let item = UITabBarItem(title: title, image: image, selectedImage: selectedImage)
        if let selectedImage, let tinted = selectedImage.withTintColor(.appOrange, renderingMode: .alwaysOriginal) as UIImage? {
            item.selectedImage = tinted
        }
        nav.tabBarItem = item
        return nav
    }

    private func applyTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.black
        appearance.shadowColor = .clear
        appearance.backgroundEffect = nil
        let normalColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        appearance.stackedLayoutAppearance.normal.iconColor = normalColor
        appearance.stackedLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: normalColor
        ]
        appearance.stackedLayoutAppearance.selected.iconColor = UIColor.appOrange
        appearance.stackedLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: UIColor.appOrange
        ]
        appearance.inlineLayoutAppearance.normal.iconColor = normalColor
        appearance.inlineLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: normalColor
        ]
        appearance.inlineLayoutAppearance.selected.iconColor = UIColor.appOrange
        appearance.inlineLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: UIColor.appOrange
        ]
        appearance.compactInlineLayoutAppearance.normal.iconColor = normalColor
        appearance.compactInlineLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: normalColor
        ]
        appearance.compactInlineLayoutAppearance.selected.iconColor = UIColor.appOrange
        appearance.compactInlineLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: UIColor.appOrange
        ]
        appearance.stackedLayoutAppearance.normal.titlePositionAdjustment = UIOffset(horizontal: 0, vertical: -2)
        appearance.stackedLayoutAppearance.selected.titlePositionAdjustment = UIOffset(horizontal: 0, vertical: -2)

        tabBar.standardAppearance = appearance
        tabBar.scrollEdgeAppearance = appearance
        tabBar.tintColor = .appOrange
        tabBar.unselectedItemTintColor = normalColor
        tabBar.isTranslucent = false
        tabBar.backgroundColor = .black
        tabBar.barTintColor = .black
        tabBar.layer.backgroundColor = UIColor.black.cgColor
        tabBar.shadowImage = UIImage()
        tabBar.backgroundImage = UIImage()
        tabBar.clipsToBounds = true
        tabBar.itemPositioning = .centered
        tabBar.itemSpacing = 14

        // Force per-item rendering + colors (in case system appearance is ignored)
        tabBar.items?.forEach { item in
            item.image = item.image?.withRenderingMode(.alwaysTemplate)
            item.selectedImage = item.selectedImage?.withRenderingMode(.alwaysTemplate)
            item.setTitleTextAttributes([.foregroundColor: normalColor], for: .normal)
            item.setTitleTextAttributes([.foregroundColor: UIColor.appOrange], for: .selected)
        }
    }
}

extension UIColor {
    /// Matches HTML orange-500 (#f97316)
    static var appOrange: UIColor {
        UIColor(red: 0xF9 / 255.0, green: 0x73 / 255.0, blue: 0x16 / 255.0, alpha: 1.0)
    }
}
