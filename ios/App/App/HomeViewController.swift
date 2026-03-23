import UIKit

final class HomeViewController: UIViewController {
    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()
    private let searchContainer = UIView()
    private let favoriteSection = UIStackView()
    private let localSection = UIStackView()

    private var isMuted = false
    private var muteItem: UIBarButtonItem?
    private var languageItem: UIBarButtonItem?
    private var currentStyle: UIUserInterfaceStyle = .unspecified
    private let languageOrder = ["中", "En", "JP"]
    private var languageIndex = 0
    private weak var centeredTitleLabel: UILabel?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 11/255, green: 11/255, blue: 15/255, alpha: 1)
        title = "主页"
        navigationItem.largeTitleDisplayMode = .never
        configureNavBar()
        buildNavItems()
        buildUI()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tabBarController?.tabBar.isHidden = false
        installCenteredTitle()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        centeredTitleLabel?.removeFromSuperview()
        centeredTitleLabel = nil
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

    private func buildNavItems() {
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

    private func buildSearchBar() {
        searchContainer.layer.cornerRadius = 16
        searchContainer.layer.borderWidth = 1
        searchContainer.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        searchContainer.backgroundColor = UIColor(red: 26/255, green: 26/255, blue: 31/255, alpha: 1)
        searchContainer.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            searchContainer.heightAnchor.constraint(equalToConstant: 40)
        ])

        let icon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        icon.tintColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        icon.translatesAutoresizingMaskIntoConstraints = false

        let placeholder = UILabel()
        placeholder.text = "搜索曲名"
        placeholder.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        placeholder.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)

        let stack = UIStackView(arrangedSubviews: [icon, placeholder])
        stack.axis = .horizontal
        stack.spacing = 8
        stack.alignment = .center
        stack.translatesAutoresizingMaskIntoConstraints = false
        searchContainer.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: searchContainer.leadingAnchor, constant: 12),
            stack.trailingAnchor.constraint(lessThanOrEqualTo: searchContainer.trailingAnchor, constant: -12),
            stack.centerYAnchor.constraint(equalTo: searchContainer.centerYAnchor),
            icon.widthAnchor.constraint(equalToConstant: 16),
            icon.heightAnchor.constraint(equalToConstant: 16)
        ])
    }

    private func buildUI() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.backgroundColor = view.backgroundColor
        view.addSubview(scrollView)

        contentStack.axis = .vertical
        contentStack.spacing = 18
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)

        NSLayoutConstraint.activate([
        scrollView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor),
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

        contentStack.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor, constant: 16),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor, constant: -16),
            contentStack.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor, constant: 12),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor, constant: -20),
            contentStack.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor, constant: -32)
        ])

        buildSearchBar()
        contentStack.addArrangedSubview(searchContainer)

        let favoritesCard = sectionCard(title: "我的收藏", subtitle: " ")
        favoriteSection.axis = .vertical
        favoriteSection.spacing = 10
        favoriteSection.translatesAutoresizingMaskIntoConstraints = false
        favoritesCard.addSubview(favoriteSection)
        NSLayoutConstraint.activate([
            favoriteSection.leadingAnchor.constraint(equalTo: favoritesCard.leadingAnchor, constant: 16),
            favoriteSection.trailingAnchor.constraint(equalTo: favoritesCard.trailingAnchor, constant: -16),
            favoriteSection.topAnchor.constraint(equalTo: favoritesCard.topAnchor, constant: 44),
            favoriteSection.bottomAnchor.constraint(equalTo: favoritesCard.bottomAnchor, constant: -16)
        ])
        favoriteSection.addArrangedSubview(buildEmptyState(title: "未登录", detail: "右上角登录后同步收藏"))
        contentStack.addArrangedSubview(favoritesCard)

        let localCard = sectionCard(title: "本地曲谱", subtitle: "已下载的爵士标准曲")
        localSection.axis = .vertical
        localSection.spacing = 10
        localSection.translatesAutoresizingMaskIntoConstraints = false
        localCard.addSubview(localSection)
        NSLayoutConstraint.activate([
            localSection.leadingAnchor.constraint(equalTo: localCard.leadingAnchor, constant: 16),
            localSection.trailingAnchor.constraint(equalTo: localCard.trailingAnchor, constant: -16),
            localSection.topAnchor.constraint(equalTo: localCard.topAnchor, constant: 44),
            localSection.bottomAnchor.constraint(equalTo: localCard.bottomAnchor, constant: -16)
        ])
        localSection.addArrangedSubview(buildSheetRow(title: "All of Me", subtitle: "C Major · AABA"))
        localSection.addArrangedSubview(buildSheetRow(title: "Autumn Leaves", subtitle: "G Minor · 32 bars"))
        localSection.addArrangedSubview(buildSheetRow(title: "Blue Bossa", subtitle: "C Minor · 16 bars"))
        contentStack.addArrangedSubview(localCard)
    }

    private func sectionCard(title: String, subtitle: String) -> UIView {
        let card = UIView()
        card.layer.cornerRadius = 20
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        card.backgroundColor = UIColor(red: 26/255, green: 26/255, blue: 31/255, alpha: 1)

        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 14, weight: .bold)
        titleLabel.textColor = UIColor(white: 0.9, alpha: 1)

        let subtitleLabel = UILabel()
        subtitleLabel.text = subtitle
        subtitleLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        subtitleLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        subtitleLabel.isHidden = subtitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty

        let header = UIStackView(arrangedSubviews: [titleLabel, UIView(), subtitleLabel])
        header.axis = .horizontal
        header.alignment = .center
        header.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(header)

        NSLayoutConstraint.activate([
            header.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            header.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
            header.topAnchor.constraint(equalTo: card.topAnchor, constant: 16)
        ])
        return card
    }

    private func buildSheetRow(title: String, subtitle: String) -> UIButton {
        let button = UIButton(type: .system)
        button.contentHorizontalAlignment = .left
        button.layer.cornerRadius = 14
        button.backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        button.layer.borderWidth = 1
        button.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor

        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 15, weight: .semibold)
        titleLabel.textColor = UIColor(white: 0.92, alpha: 1)

        let subtitleLabel = UILabel()
        subtitleLabel.text = subtitle
        subtitleLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        subtitleLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)

        let stack = UIStackView(arrangedSubviews: [titleLabel, subtitleLabel])
        stack.axis = .vertical
        stack.spacing = 4
        stack.translatesAutoresizingMaskIntoConstraints = false
        button.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: button.leadingAnchor, constant: 14),
            stack.trailingAnchor.constraint(equalTo: button.trailingAnchor, constant: -14),
            stack.topAnchor.constraint(equalTo: button.topAnchor, constant: 12),
            stack.bottomAnchor.constraint(equalTo: button.bottomAnchor, constant: -12)
        ])
        return button
    }

    private func buildEmptyState(title: String, detail: String) -> UIView {
        let container = UIView()
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        titleLabel.textColor = UIColor(white: 0.92, alpha: 1)
        let detailLabel = UILabel()
        detailLabel.text = detail
        detailLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        detailLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        detailLabel.numberOfLines = 0

        let stack = UIStackView(arrangedSubviews: [titleLabel, detailLabel])
        stack.axis = .vertical
        stack.spacing = 4
        stack.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            stack.topAnchor.constraint(equalTo: container.topAnchor),
            stack.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])
        return container
    }

    @objc private func openLogin() {
        let login = LoginViewController()
        navigationController?.pushViewController(login, animated: true)
    }

    @objc private func toggleMute() {
        isMuted.toggle()
        let imageName = isMuted ? "speaker.slash" : "speaker.wave.2"
        updateCircleItem(muteItem, title: nil, systemImage: imageName)
    }

    private func applyTheme() {
        let imageName: String
        switch currentStyle {
        case .light:
            imageName = "sun.max"
        case .dark:
            imageName = "moon"
        default:
            imageName = "moon"
        }
        view.window?.overrideUserInterfaceStyle = currentStyle
        tabBarController?.view.window?.overrideUserInterfaceStyle = currentStyle
        navigationController?.view.window?.overrideUserInterfaceStyle = currentStyle
    }

    @objc private func changeLanguage() {
        languageIndex = (languageIndex + 1) % languageOrder.count
        updateCircleItem(languageItem, title: languageOrder[languageIndex], systemImage: nil)
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
