import UIKit
import WebKit
import Capacitor

final class LegacyWebViewController: CAPBridgeViewController {
    private let initialView: String
    private let languageOrder = ["中", "En", "JP"]
    private var languageIndex = 0
    private var backItem: UIBarButtonItem?
    private var viewPollTimer: Timer?
    private weak var centeredTitleLabel: UILabel?
    private var isMuted = false
    private var muteItem: UIBarButtonItem?
    private var languageItem: UIBarButtonItem?

    init(initialView: String) {
        self.initialView = initialView
        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        configureNavBar()
        configureNavItems()
        bridge?.webView?.scrollView.showsVerticalScrollIndicator = false
        bridge?.webView?.scrollView.showsHorizontalScrollIndicator = false
        bridge?.webView?.scrollView.scrollsToTop = false
        bridge?.webView?.isOpaque = false
        bridge?.webView?.backgroundColor = UIColor.black

        // NOTE: Cache clearing disabled to avoid memory spikes on launch.
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // One-time initialization + always hide HTML nav.
        bridge?.webView?.evaluateJavaScript("""
            (function() {
              const styleId = 'legacy-style';
              if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                  ::-webkit-scrollbar { display: none; }
                  body, .content-area { scrollbar-width: none; -ms-overflow-style: none; }
                `;
                document.head.appendChild(style);
              }
              document.querySelector('header')?.style.setProperty('display','none');
              document.querySelector('.content-area')?.style.setProperty('padding-top','0');
              document.getElementById('home-view')?.style.setProperty('display','none');
              document.documentElement.classList.add('dark');
              document.body.classList.add('dark');
              if (!window.__legacyInitialized) {
                window.__legacyInitialized = true;
                if (window.goToView) { window.goToView('\(initialView)'); }
              } else {
                if (window.currentView === 'home' && window.goToView) {
                  window.goToView('\(initialView)');
                }
              }
            })();
        """, completionHandler: nil)
        startViewPolling()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        viewPollTimer?.invalidate()
        viewPollTimer = nil
        centeredTitleLabel?.removeFromSuperview()
        centeredTitleLabel = nil
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tabBarController?.tabBar.isHidden = false
        installCenteredTitle()
        // Reset scroll position when re-entering, but keep state.
        bridge?.webView?.evaluateJavaScript("""
            (function() {
              const content = document.querySelector('.content-area');
              if (content) content.scrollTop = 0;
              window.scrollTo(0, 0);
            })();
        """, completionHandler: nil)
    }

    private func installCenteredTitle() {
        guard let navBar = navigationController?.navigationBar else { return }
        navigationItem.titleView = UIView()
        centeredTitleLabel?.removeFromSuperview()
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = title
        label.font = UIFont.systemFont(ofSize: 17, weight: .semibold)
        label.textColor = UIColor.white
        label.textAlignment = .center
        navBar.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: navBar.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: navBar.centerYAnchor)
        ])
        centeredTitleLabel = label
    }

    private func configureNavBar() {
        navigationItem.largeTitleDisplayMode = .never
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.black
        appearance.titleTextAttributes = [
            .foregroundColor: UIColor.white,
            .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
        ]
        appearance.shadowColor = .clear
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
        navigationController?.navigationBar.tintColor = UIColor.appOrange
    }

    private func configureNavItems() {
        let languageItem = makeCircleItem(
            title: languageOrder[languageIndex],
            systemImage: nil,
            action: #selector(changeLanguage)
        )
        self.languageItem = languageItem
        let muteItem = makeCircleItem(
            title: nil,
            systemImage: "speaker.wave.2",
            action: #selector(toggleMute)
        )
        self.muteItem = muteItem
        let spacer = UIBarButtonItem(barButtonSystemItem: .fixedSpace, target: nil, action: nil)
        spacer.width = 8
        navigationItem.rightBarButtonItems = [muteItem, spacer, languageItem]
    }

    private func startViewPolling() {
        viewPollTimer?.invalidate()
        viewPollTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            self?.syncBackButton()
        }
    }

    private func syncBackButton() {
        bridge?.webView?.evaluateJavaScript("window.currentView") { [weak self] result, _ in
            guard let self else { return }
            let shouldShow = (result as? String) == "test"
            if shouldShow {
                if self.backItem == nil {
                    self.backItem = UIBarButtonItem(
                        image: UIImage(systemName: "arrow.left"),
                        style: .plain,
                        target: self,
                        action: #selector(self.goBackInWeb)
                    )
                }
                self.navigationItem.leftBarButtonItem = self.backItem
            } else {
                self.navigationItem.leftBarButtonItem = nil
            }
        }
    }

    @objc private func goBackInWeb() {
        bridge?.webView?.evaluateJavaScript("window.goBack && window.goBack();", completionHandler: nil)
    }

    @objc private func changeLanguage() {
        languageIndex = (languageIndex + 1) % languageOrder.count
        updateCircleItem(languageItem, title: languageOrder[languageIndex], systemImage: nil)
        let key = ["zh", "en", "jp"][languageIndex]
        bridge?.webView?.evaluateJavaScript("window.setLanguage && window.setLanguage('\(key)');", completionHandler: nil)
    }

    @objc private func toggleMute() {
        isMuted.toggle()
        let imageName = isMuted ? "speaker.slash" : "speaker.wave.2"
        updateCircleItem(muteItem, title: nil, systemImage: imageName)
        bridge?.webView?.evaluateJavaScript("window.setMute && window.setMute(\(isMuted ? "true" : "false"));", completionHandler: nil)
    }

    private func makeCircleItem(title: String?, systemImage: String?, action: Selector) -> UIBarButtonItem {
        let button = UIButton(type: .system)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.backgroundColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1)
        button.layer.cornerRadius = 16
        button.clipsToBounds = true
        button.widthAnchor.constraint(equalToConstant: 32).isActive = true
        button.heightAnchor.constraint(equalToConstant: 32).isActive = true
        button.titleLabel?.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
        button.setTitleColor(UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1), for: .normal)
        button.tintColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        if let title {
            button.setTitle(title, for: .normal)
        } else if let systemImage {
            let config = UIImage.SymbolConfiguration(pointSize: 14, weight: .medium)
            button.setImage(UIImage(systemName: systemImage, withConfiguration: config), for: .normal)
        }
        button.addTarget(self, action: action, for: .touchUpInside)
        return UIBarButtonItem(customView: button)
    }

    private func updateCircleItem(_ item: UIBarButtonItem?, title: String?, systemImage: String?) {
        guard let button = item?.customView as? UIButton else { return }
        if let title {
            button.setImage(nil, for: .normal)
            button.setTitle(title, for: .normal)
        } else if let systemImage {
            button.setTitle(nil, for: .normal)
            button.setImage(UIImage(systemName: systemImage), for: .normal)
        }
    }

}
