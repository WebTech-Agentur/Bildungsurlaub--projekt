/* ==========================================================================
   NÓOS LEADERSHIP - INTERACTIVE WEB APP SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. CLIENT-SIDE SPA ROUTER
       ========================================== */
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, .logo');
    
    function navigateToHash() {
        const fullHash = window.location.hash || '#home';
        // Handle sub-target anchors in the URL like #bildungsurlaub#bu-finder
        const hashParts = fullHash.split('#');
        const mainHash = '#' + (hashParts[1] || 'home');
        const subTargetId = hashParts[2] || null;

        let activeSection = document.querySelector(mainHash);
        
        // Default to home if hash doesn't match any section
        if (!activeSection) {
            activeSection = document.getElementById('home');
        }

        // Hide all sections, display and animate active section
        sections.forEach(sec => {
            sec.classList.remove('active-page');
        });
        
        activeSection.classList.add('active-page');

        // Update nav link active state
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith(mainHash)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile navigation drawer if open
        const mainNav = document.getElementById('main-nav');
        const mobileToggle = document.getElementById('mobile-toggle');
        if (mainNav && mainNav.classList.contains('mobile-active')) {
            mainNav.classList.remove('mobile-active');
            mobileToggle.classList.remove('open');
        }

        // Scroll management
        if (subTargetId) {
            // Wait for section animation to settle, then scroll to sub-target element
            setTimeout(() => {
                const subElement = document.getElementById(subTargetId);
                if (subElement) {
                    subElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    // Router event listeners
    window.addEventListener('hashchange', navigateToHash);
    navigateToHash(); // Initialize on load

    // Intercept clicks on links inside the mega-menu with data-target
    document.querySelectorAll('.megamenu a[data-target], .footer-links a[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentSection = link.getAttribute('href'); // e.g. #bildungsurlaub
            const targetElementId = link.getAttribute('data-target'); // e.g. bu-finder
            
            // Navigate using composite hash
            window.location.hash = `${parentSection}#${targetElementId}`;
        });
    });


    /* ==========================================
       2. RESPONSIVE MOBILE NAVIGATION DRAWER
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mainNav.classList.toggle('mobile-active');
        });
    }

    // Accordion expand for mega-menu elements on mobile
    const mobileParentItems = document.querySelectorAll('.has-megamenu > a');
    mobileParentItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const parent = item.parentElement;
                parent.classList.toggle('mobile-expand');
            }
        });
    });


    /* ==========================================
       3. INTERACTIVE DAILY TIMELINE WIDGET
       ========================================== */
    const timelineTabs = document.querySelectorAll('.timeline-tab');
    const timelinePanes = document.querySelectorAll('.timeline-pane');

    timelineTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            timelineTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            // Find matching pane
            const timeTarget = tab.getAttribute('data-time');
            timelinePanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${timeTarget}`) {
                    pane.classList.add('active');
                }
            });
        });
    });


    /* ==========================================
       4. GERMAN BUNDESLAND FINDER DATABASE & WIDGET
       ========================================== */
    const bundeslandSelect = document.getElementById('bundesland-select');
    const finderResult = document.getElementById('finder-result');
    const resBadge = document.getElementById('res-badge');
    const resTitle = document.getElementById('res-title');
    const resDescription = document.getElementById('res-description');
    const resDeadline = document.getElementById('res-deadline');
    const resDocument = document.getElementById('res-document');
    const finderCtaBtn = document.getElementById('finder-cta-btn');

    // Database containing specific details for all 16 German states
    const bundeslandData = {
        nw: {
            title: "Nordrhein-Westfalen (NRW)",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid NRW (5 Tage)",
            desc: "Das Seminar ist in NRW voll anerkannt. Arbeitnehmer haben Anspruch auf 5 Arbeitstage Freistellung pro Kalenderjahr. Bitte reichen Sie den Antrag mind. 6 Wochen vor Seminarbeginn bei Ihrem Arbeitgeber ein."
        },
        he: {
            title: "Hessen",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Hessen (5 Tage)",
            desc: "In Hessen ist unser Programm vollständig freigabefähig. Sie können bis zu 5 Tage für dieses Retreat beanspruchen. Denken Sie an die gesetzliche 6-Wochen-Frist für Ihren Arbeitgeber."
        },
        bw: {
            title: "Baden-Württemberg",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "8 Wochen vor Beginn",
            document: "Anerkennungsbescheid BW (Ref. VO-2026)",
            desc: "Baden-Württemberg hat strenge formelle Richtlinien, denen unser Kurs jedoch voll entspricht. Wichtig: Der Antrag muss schriftlich mindestens 8 Wochen vor Kursbeginn vorliegen."
        },
        by: {
            title: "Bayern",
            status: "Kein Gesetz",
            badgeClass: "badge-warning",
            deadline: "Individuelle Absprache",
            document: "Förder- & Motivationsfibel Bayern",
            desc: "Bayern hat als eines von zwei Bundesländern kein eigenes Bildungsurlaubsgesetz. Dennoch genehmigen bayerische Arbeitgeber die Teilnahme oft auf freiwilliger Basis (z.B. als betriebliche Weiterbildung). Wir stellen Ihnen hierfür eine spezielle Argumentationshilfe zur Verfügung."
        },
        be: {
            title: "Berlin",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Berlin",
            desc: "Berliner Arbeitnehmer können problemlos teilnehmen. Die Weiterbildungsmaßnahme erfüllt alle Kriterien des Berliner Bildungszeitgesetzes (BiZg)."
        },
        hh: {
            title: "Hamburg",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Hamburg (5 Tage)",
            desc: "Hamburgische Arbeitnehmer haben vollen gesetzlichen Anspruch. Ideal als zertifizierte Präventionsmaßnahme zur mentalen Gesundheit absetzbar."
        },
        ni: {
            title: "Niedersachsen",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "4 Wochen vor Beginn",
            document: "Anerkennungsbescheid Niedersachsen",
            desc: "In Niedersachsen profitieren Sie von einer verkürzten Antragsfrist von 4 Wochen. Das Programm ist nach dem NBildUG offiziell anerkannt."
        },
        rp: {
            title: "Rheinland-Pfalz",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid RLP",
            desc: "Vollständige staatliche Anerkennung liegt vor. Nutzen Sie Ihre 5 Tage bezahlten Sonderurlaub für nachhaltige Resilienzstärkung an der Ägäis."
        },
        sl: {
            title: "Saarland",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Saarland (SBUG)",
            desc: "Anerkannt nach dem saarländischen Bildungsfreistellungsgesetz. Sichern Sie sich die Freistellung unkompliziert."
        },
        sh: {
            title: "Schleswig-Holstein",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid SH (WBFG)",
            desc: "Die schleswig-holsteinische Landesregierung erkennt unseren Kurs vollumfänglich an. Dokumente zur Vorlage bei der Personalabteilung erhalten Sie direkt bei uns."
        },
        sn: {
            title: "Sachsen",
            status: "Kein Gesetz",
            badgeClass: "badge-warning",
            deadline: "Individuelle Absprache",
            document: "Fördermappe Sachsen (Freistellungs-Leitfaden)",
            desc: "In Sachsen gibt es leider kein Bildungsurlaubsgesetz. Sie können aber mit unserem detaillierten Verlaufsplan eine Freistellung im Rahmen der betrieblichen Gesundheitsförderung (BGF) anfragen. Wir beraten Sie gern!"
        },
        st: {
            title: "Sachsen-Anhalt",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Sachsen-Anhalt",
            desc: "Vollständig anerkannt nach dem Bildungsfreistellungsgesetz von Sachsen-Anhalt. Nutzen Sie Ihren Anspruch auf berufliche Fortbildung."
        },
        th: {
            title: "Thüringen",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "8 Wochen vor Beginn",
            document: "Anerkennungsbescheid Thüringen (ThürBfG)",
            desc: "Offiziell anerkannt in Thüringen. Bitte beachten Sie die 8-wöchige gesetzliche Vorlagefrist bei Ihrem Arbeitgeber."
        },
        hb: {
            title: "Bremen",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "4 Wochen vor Beginn",
            document: "Anerkennungsbescheid Bremen (BremBUG)",
            desc: "Bremer Arbeitnehmer können mit einer kurzen Frist von 4 Wochen einreichen. Volle gesetzliche Freistellung garantiert."
        },
        mv: {
            title: "Mecklenburg-Vorpommern",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "8 Wochen vor Beginn",
            document: "Anerkennungsbescheid MV (BfG M-V)",
            desc: "Unser Kurs ist in Mecklenburg-Vorpommern staatlich zertifiziert. Aufgrund der 8-Wochen-Frist empfehlen wir eine frühzeitige Beantragung."
        },
        bb: {
            title: "Brandenburg",
            status: "Anerkannt",
            badgeClass: "",
            deadline: "6 Wochen vor Beginn",
            document: "Anerkennungsbescheid Brandenburg (BbgBUG)",
            desc: "Brandenburger Angestellte haben einen gesetzlich gesicherten Freistellungsanspruch. Sämtliche Nachweise stellen wir Ihnen lückenlos aus."
        }
    };

    if (bundeslandSelect) {
        bundeslandSelect.addEventListener('change', () => {
            const key = bundeslandSelect.value;
            if (key && bundeslandData[key]) {
                const data = bundeslandData[key];
                
                // Update widget text
                resTitle.textContent = data.title;
                resBadge.textContent = data.status;
                resBadge.className = `result-badge ${data.badgeClass}`;
                resDescription.textContent = data.desc;
                resDeadline.textContent = data.deadline;
                resDocument.textContent = data.document;

                // Adjust CTA button target so it includes the state
                finderCtaBtn.setAttribute('href', `#kontakt`);
                finderCtaBtn.addEventListener('click', () => {
                    const wizardStateSelect = document.getElementById('w-state');
                    if (wizardStateSelect) {
                        wizardStateSelect.value = key;
                    }
                });

                // Display result box with smooth transition
                finderResult.style.display = 'block';
            } else {
                finderResult.style.display = 'none';
            }
        });
    }


    /* ==========================================
       5. MULTI-STEP INQUIRY WIZARD
       ========================================== */
    const wizardForm = document.getElementById('inquiry-wizard-form');
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    const wizardPanes = document.querySelectorAll('.wizard-pane');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 1;

    function showStep(stepNumber) {
        wizardPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(`w-pane-${stepNumber}`).classList.add('active');

        // Update progress bar
        progressSteps.forEach((step, idx) => {
            const stepIndex = idx + 1;
            step.classList.remove('active', 'completed');

            if (stepIndex === stepNumber) {
                step.classList.add('active');
            } else if (stepIndex < stepNumber) {
                step.classList.add('completed');
            }
        });
        
        currentStep = stepNumber;
    }

    function validatePane(paneId) {
        const pane = document.getElementById(paneId);
        const requiredElements = pane.querySelectorAll('[required]');
        let isValid = true;

        requiredElements.forEach(el => {
            const formGroup = el.closest('.form-group');
            
            if (el.type === 'checkbox') {
                if (!el.checked) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('has-error');
                }
            } else {
                if (!el.value.trim()) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                } else if (el.type === 'email') {
                    // Simple email regex validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(el.value.trim())) {
                        formGroup.classList.add('has-error');
                        isValid = false;
                    } else {
                        formGroup.classList.remove('has-error');
                    }
                } else {
                    formGroup.classList.remove('has-error');
                }
            }
        });

        return isValid;
    }

    // Real-time error removal
    document.querySelectorAll('.form-control, input[type="checkbox"]').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('has-error');
            }
        });
        input.addEventListener('change', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('has-error');
            }
        });
    });

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validatePane(`w-pane-${currentStep}`)) {
                showStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });

    // Handle form submit
    if (wizardForm) {
        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validatePane(`w-pane-${currentStep}`)) {
                // Fetch user data for the final dynamic success pane
                const firstName = document.getElementById('w-fname').value.trim();
                const termSelect = document.getElementById('w-term');
                const termText = termSelect.options[termSelect.selectedIndex].text.split(' - ')[0];
                const packageSelect = document.getElementById('w-package');
                const packageText = packageSelect.options[packageSelect.selectedIndex].text.split(' (€')[0];
                const stateSelect = document.getElementById('w-state');
                const stateText = stateSelect.options[stateSelect.selectedIndex].text.split(' (')[0];

                // Inject variables into Step 4
                document.getElementById('dyn-fname').textContent = firstName;
                document.getElementById('dyn-package').textContent = packageText;
                document.getElementById('dyn-date').textContent = termText;
                document.getElementById('dyn-state').textContent = stateText;

                // Advance to success pane
                showStep(4);
                
                // Clear inputs except success
                wizardForm.reset();
            }
        });
    }

    // Click handler for backing out of success page
    const backToHomeBtn = document.getElementById('btn-back-to-home');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            showStep(1); // Reset wizard back to step 1
        });
    }


    /* ==========================================
       6. SELECT PACKAGE SHORTCUTS FROM CARDS
       ========================================== */
    const selectPackageButtons = document.querySelectorAll('.btn-select-package');
    selectPackageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const packageName = btn.getAttribute('data-package');
            const wizardPackageSelect = document.getElementById('w-package');
            
            if (wizardPackageSelect) {
                wizardPackageSelect.value = packageName;
            }

            // Always reset the wizard to step 1 when a package is selected
            showStep(1);
        });
    });


    /* ==========================================
       7. SMOOTH ENTRANCE INTERSECTION OBSERVATION
       ========================================== */
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('revealed'));
    }


    /* ==========================================
       8. COLLAPSIBLE ACCORDION ITEMS (FAQ)
       ========================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.faq-content');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

});
