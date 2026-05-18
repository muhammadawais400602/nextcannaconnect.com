import flet as ft


def main(page: ft.Page):
    page.title = "AussieFit"
    page.bgcolor = ft.Colors.WHITE
    page.padding = 0
    page.window.width = 390
    page.window.height = 844
    page.window.resizable = False
    page.fonts = {
        "SF": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    }

    # ── state ──────────────────────────────────────────────────────────────
    active_tab = ft.Ref[str]()
    active_tab.current = "ALL"
    active_nav = ft.Ref[int]()
    active_nav.current = 2  # Workouts tab

    # ── colours ────────────────────────────────────────────────────────────
    DARK_NAVY = "#1a1f2e"
    NAVY = "#1e2a4a"
    PINK = "#e91e8c"
    PURPLE = "#9b59b6"
    GREEN = "#4caf50"
    LIGHT_GREY = "#f5f5f5"
    MID_GREY = "#888888"
    TAG_BG = "#f0f0f0"

    # ── helpers ────────────────────────────────────────────────────────────
    def tag_chip(label: str, color: str = "#444444"):
        return ft.Container(
            content=ft.Text(label, size=9, weight=ft.FontWeight.W_600, color=color),
            bgcolor=TAG_BG,
            border_radius=4,
            padding=ft.padding.symmetric(horizontal=8, vertical=3),
        )

    def difficulty_badge(text: str, bg: str = "#444444"):
        return ft.Container(
            content=ft.Text(text, size=9, weight=ft.FontWeight.W_700, color=ft.Colors.WHITE),
            bgcolor=bg,
            border_radius=ft.border_radius.only(top_right=8, bottom_left=8),
            padding=ft.padding.symmetric(horizontal=8, vertical=4),
        )

    badge_colors = {
        "HIIT": "#2196f3",
        "STRENGTH": "#f44336",
        "MOBILITY": "#607d8b",
    }

    def workout_card(
        image_url: str,
        badge: str,
        title: str,
        duration: str,
        level: str,
        tags: list[str],
    ):
        badge_color = badge_colors.get(badge, "#444")
        tag_row = ft.Row(
            controls=[tag_chip(t) for t in tags],
            spacing=6,
        )
        return ft.Container(
            content=ft.Column(
                controls=[
                    ft.Stack(
                        controls=[
                            ft.Container(
                                content=ft.Image(
                                    src=image_url,
                                    width=double,
                                    height=180,
                                    fit=ft.ImageFit.COVER,
                                    border_radius=ft.border_radius.only(
                                        top_left=12, top_right=12
                                    ),
                                ),
                                border_radius=ft.border_radius.only(
                                    top_left=12, top_right=12
                                ),
                                clip_behavior=ft.ClipBehavior.HARD_EDGE,
                            ),
                            ft.Container(
                                content=difficulty_badge(badge, badge_color),
                                right=0,
                                top=0,
                            ),
                        ],
                        width=double,
                        height=180,
                    ),
                    ft.Container(
                        content=ft.Column(
                            controls=[
                                ft.Text(
                                    title,
                                    size=17,
                                    weight=ft.FontWeight.W_700,
                                    color="#1a1a1a",
                                ),
                                ft.Row(
                                    controls=[
                                        ft.Row(
                                            controls=[
                                                ft.Icon(
                                                    ft.Icons.ACCESS_TIME,
                                                    size=13,
                                                    color=MID_GREY,
                                                ),
                                                ft.Text(
                                                    duration,
                                                    size=12,
                                                    color=MID_GREY,
                                                ),
                                            ],
                                            spacing=3,
                                        ),
                                        ft.Row(
                                            controls=[
                                                ft.Icon(
                                                    ft.Icons.SIGNAL_CELLULAR_ALT,
                                                    size=13,
                                                    color=MID_GREY,
                                                ),
                                                ft.Text(
                                                    level,
                                                    size=12,
                                                    color=MID_GREY,
                                                ),
                                            ],
                                            spacing=3,
                                        ),
                                    ],
                                    spacing=16,
                                ),
                                tag_row,
                                ft.Container(
                                    content=ft.Text(
                                        "START WORKOUT",
                                        size=13,
                                        weight=ft.FontWeight.W_700,
                                        color=ft.Colors.WHITE,
                                        text_align=ft.TextAlign.CENTER,
                                    ),
                                    bgcolor=NAVY,
                                    border_radius=8,
                                    padding=ft.padding.symmetric(vertical=13),
                                    width=double,
                                    on_click=lambda _: None,
                                    ink=True,
                                ),
                            ],
                            spacing=10,
                        ),
                        padding=ft.padding.all(14),
                    ),
                ],
                spacing=0,
            ),
            border=ft.border.all(1, "#e8e8e8"),
            border_radius=12,
            bgcolor=ft.Colors.WHITE,
            shadow=ft.BoxShadow(
                blur_radius=8,
                color=ft.Colors.with_opacity(0.06, ft.Colors.BLACK),
                offset=ft.Offset(0, 2),
            ),
        )

    # placeholder value – will be replaced after layout width is known
    double = 340

    # ── filter tabs ────────────────────────────────────────────────────────
    tabs = ["ALL", "HIIT", "Strength", "Yoga"]
    tab_row_ref = ft.Ref[ft.Row]()

    def build_tab(label: str):
        is_active = label == active_tab.current

        def on_tap(_e, lbl=label):
            active_tab.current = lbl
            rebuild_tabs()

        return ft.GestureDetector(
            content=ft.Container(
                content=ft.Text(
                    label,
                    size=13,
                    weight=ft.FontWeight.W_600,
                    color=ft.Colors.WHITE if is_active else "#555555",
                ),
                bgcolor=NAVY if is_active else ft.Colors.TRANSPARENT,
                border_radius=20,
                padding=ft.padding.symmetric(horizontal=16, vertical=7),
            ),
            on_tap=on_tap,
        )

    def rebuild_tabs():
        tab_row_ref.current.controls = [build_tab(t) for t in tabs]
        page.update()

    # ── hero banner ────────────────────────────────────────────────────────
    hero = ft.Container(
        content=ft.Stack(
            controls=[
                ft.Image(
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
                    width=double,
                    height=170,
                    fit=ft.ImageFit.COVER,
                ),
                ft.Container(
                    bgcolor=ft.Colors.with_opacity(0.62, "#0d1526"),
                    width=double,
                    height=170,
                ),
                ft.Container(
                    content=ft.Column(
                        controls=[
                            ft.Text(
                                "A complete 7-day blueprint designed\nto push your limits and maximize\nstrength gains using professional-\ngrade techniques.",
                                size=12,
                                color=ft.Colors.WHITE,
                                weight=ft.FontWeight.W_500,
                            ),
                            ft.Container(height=8),
                            ft.Container(
                                content=ft.Text(
                                    "Start Program",
                                    size=13,
                                    weight=ft.FontWeight.W_700,
                                    color=ft.Colors.WHITE,
                                    text_align=ft.TextAlign.CENTER,
                                ),
                                bgcolor=GREEN,
                                border_radius=8,
                                padding=ft.padding.symmetric(horizontal=22, vertical=10),
                                on_click=lambda _: None,
                                ink=True,
                            ),
                        ],
                        spacing=0,
                        horizontal_alignment=ft.CrossAxisAlignment.START,
                    ),
                    padding=ft.padding.all(16),
                ),
            ],
            width=double,
            height=170,
        ),
        border_radius=14,
        clip_behavior=ft.ClipBehavior.HARD_EDGE,
    )

    # ── recipe card ────────────────────────────────────────────────────────
    recipe_card = ft.Container(
        content=ft.Column(
            controls=[
                ft.Container(
                    content=ft.Image(
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
                        width=double,
                        height=160,
                        fit=ft.ImageFit.COVER,
                    ),
                    clip_behavior=ft.ClipBehavior.HARD_EDGE,
                    border_radius=ft.border_radius.only(top_left=14, top_right=14),
                ),
                ft.Container(
                    content=ft.Column(
                        controls=[
                            ft.Text(
                                "Post-workout Fuel",
                                size=18,
                                weight=ft.FontWeight.W_800,
                                color=PINK,
                                text_align=ft.TextAlign.CENTER,
                            ),
                            ft.Text(
                                "Maximize your results with 15+ curated\nrecipes for optimal muscle recovery\nand energy restoration.",
                                size=13,
                                color="#555555",
                                text_align=ft.TextAlign.CENTER,
                            ),
                            ft.Container(height=4),
                            ft.Container(
                                content=ft.Text(
                                    "Explore Recipes",
                                    size=13,
                                    weight=ft.FontWeight.W_600,
                                    color=NAVY,
                                    text_align=ft.TextAlign.CENTER,
                                ),
                                border=ft.border.all(1.5, NAVY),
                                border_radius=8,
                                padding=ft.padding.symmetric(horizontal=24, vertical=10),
                                on_click=lambda _: None,
                                ink=True,
                            ),
                        ],
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=8,
                    ),
                    padding=ft.padding.all(16),
                ),
            ],
            spacing=0,
        ),
        border=ft.border.all(1, "#e8e8e8"),
        border_radius=14,
        bgcolor=ft.Colors.WHITE,
        shadow=ft.BoxShadow(
            blur_radius=8,
            color=ft.Colors.with_opacity(0.06, ft.Colors.BLACK),
            offset=ft.Offset(0, 2),
        ),
    )

    # ── workout cards data ─────────────────────────────────────────────────
    workout_data = [
        {
            "image_url": "https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=80",
            "badge": "HIIT",
            "title": "Total Body Burnout",
            "duration": "35 min",
            "level": "Advanced",
            "tags": ["DUMBBELLS", "MAT"],
        },
        {
            "image_url": "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=80",
            "badge": "STRENGTH",
            "title": "Lower Body Power",
            "duration": "45 min",
            "level": "Intermediate",
            "tags": ["BARBELL", "BENCH"],
        },
        {
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            "badge": "MOBILITY",
            "title": "Post-Run Recovery",
            "duration": "20 min",
            "level": "Beginner",
            "tags": ["NO EQUIPMENT"],
        },
    ]

    workout_cards = [workout_card(**w) for w in workout_data]

    # ── bottom nav ─────────────────────────────────────────────────────────
    nav_items = [
        (ft.Icons.DASHBOARD_OUTLINED, ft.Icons.DASHBOARD, "Dashboard"),
        (ft.Icons.DIRECTIONS_RUN_OUTLINED, ft.Icons.DIRECTIONS_RUN, "Activity"),
        (ft.Icons.FITNESS_CENTER_OUTLINED, ft.Icons.FITNESS_CENTER, "Workouts"),
        (ft.Icons.PERSON_OUTLINE, ft.Icons.PERSON, "Profile"),
    ]

    nav_ref = ft.Ref[ft.Row]()

    def build_nav(active_idx: int):
        items = []
        for i, (icon_out, icon_filled, label) in enumerate(nav_items):
            is_active = i == active_idx
            icon = icon_filled if is_active else icon_out
            color = NAVY if is_active else MID_GREY

            def on_nav(_e, idx=i):
                active_nav.current = idx
                nav_ref.current.controls = build_nav(idx)
                page.update()

            items.append(
                ft.GestureDetector(
                    content=ft.Container(
                        content=ft.Column(
                            controls=[
                                ft.Icon(icon, color=color, size=22),
                                ft.Text(
                                    label,
                                    size=10,
                                    color=color,
                                    weight=ft.FontWeight.W_600
                                    if is_active
                                    else ft.FontWeight.W_400,
                                ),
                            ],
                            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                            spacing=2,
                        ),
                        padding=ft.padding.symmetric(vertical=6, horizontal=8),
                    ),
                    on_tap=on_nav,
                )
            )
        return items

    bottom_nav = ft.Container(
        content=ft.Row(
            ref=nav_ref,
            controls=build_nav(active_nav.current),
            alignment=ft.MainAxisAlignment.SPACE_AROUND,
        ),
        bgcolor=ft.Colors.WHITE,
        border=ft.border.only(top=ft.BorderSide(1, "#e0e0e0")),
        padding=ft.padding.symmetric(vertical=4),
    )

    # ── header ─────────────────────────────────────────────────────────────
    header = ft.Container(
        content=ft.Row(
            controls=[
                ft.Row(
                    controls=[
                        ft.Container(
                            content=ft.Image(
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
                                width=38,
                                height=38,
                                fit=ft.ImageFit.COVER,
                                border_radius=19,
                            ),
                            border_radius=19,
                            clip_behavior=ft.ClipBehavior.HARD_EDGE,
                            width=38,
                            height=38,
                        ),
                        ft.Text(
                            "AussieFit",
                            size=22,
                            weight=ft.FontWeight.W_800,
                            color="#1a1a1a",
                        ),
                    ],
                    spacing=10,
                ),
                ft.IconButton(
                    icon=ft.Icons.SETTINGS_OUTLINED,
                    icon_color="#1a1a1a",
                    icon_size=22,
                    on_click=lambda _: None,
                ),
            ],
            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
        ),
        padding=ft.padding.symmetric(horizontal=16, vertical=12),
        bgcolor=ft.Colors.WHITE,
    )

    # ── scrollable body ────────────────────────────────────────────────────
    body = ft.Column(
        controls=[
            # filter tabs
            ft.Container(
                content=ft.Row(
                    ref=tab_row_ref,
                    controls=[build_tab(t) for t in tabs],
                    spacing=4,
                    scroll=ft.ScrollMode.HIDDEN,
                ),
                padding=ft.padding.symmetric(horizontal=16, vertical=4),
            ),
            # hero
            ft.Container(
                content=hero,
                padding=ft.padding.symmetric(horizontal=16),
            ),
            # recipe card
            ft.Container(
                content=recipe_card,
                padding=ft.padding.symmetric(horizontal=16),
            ),
            # section header
            ft.Container(
                content=ft.Row(
                    controls=[
                        ft.Text(
                            "Daily Workouts",
                            size=19,
                            weight=ft.FontWeight.W_800,
                            color="#1a1a1a",
                        ),
                        ft.Row(
                            controls=[
                                ft.Text(
                                    "VIEW ALL",
                                    size=12,
                                    weight=ft.FontWeight.W_600,
                                    color=NAVY,
                                ),
                                ft.Icon(
                                    ft.Icons.ARROW_FORWARD,
                                    size=14,
                                    color=NAVY,
                                ),
                            ],
                            spacing=2,
                        ),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                ),
                padding=ft.padding.symmetric(horizontal=16, vertical=4),
            ),
            # workout cards
            *[
                ft.Container(
                    content=card,
                    padding=ft.padding.symmetric(horizontal=16),
                )
                for card in workout_cards
            ],
            ft.Container(height=12),
        ],
        spacing=12,
        scroll=ft.ScrollMode.AUTO,
        expand=True,
    )

    # ── page layout ────────────────────────────────────────────────────────
    page.add(
        ft.Column(
            controls=[
                header,
                ft.Divider(height=1, color="#e8e8e8"),
                body,
                bottom_nav,
            ],
            spacing=0,
            expand=True,
        )
    )


ft.app(target=main)
