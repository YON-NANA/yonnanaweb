document.addEventListener('DOMContentLoaded', () => {
    // Header background change on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Modal Logic ---

    // 1. Foster Conditions Modal
    const modalConditions = document.getElementById('modalConditions');
    const btnShowConditions = document.getElementById('btnShowConditionsMain');
    const btnCloseConditions = document.getElementById('closeModal');

    // 2. Animal Detail Modal
    const modalAnimal = document.getElementById('modalAnimal');
    const btnCloseAnimal = document.getElementById('closeAnimalModal');

    // Show Conditions
    if (btnShowConditions && modalConditions) {
        btnShowConditions.addEventListener('click', (e) => {
            e.preventDefault();
            modalConditions.classList.add('active');
            modalConditions.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Conditions
    if (btnCloseConditions && modalConditions) {
        btnCloseConditions.addEventListener('click', () => {
            modalConditions.classList.remove('active');
            modalConditions.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close Animal Detail
    if (btnCloseAnimal && modalAnimal) {
        btnCloseAnimal.addEventListener('click', () => {
            modalAnimal.classList.remove('active');
            modalAnimal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modalConditions) {
            modalConditions.classList.remove('active');
            modalConditions.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === modalAnimal) {
            modalAnimal.classList.remove('active');
            modalAnimal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- Animations & Other Logic ---

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    window.refreshScrollAnimations = () => {
        const elementsToAnimate = document.querySelectorAll('.about-images, .about-text, .activity-card, .reality-item, .foster-card');
        elementsToAnimate.forEach(el => {
            if (!el.classList.contains('show')) {
                el.classList.add('hidden');
                observer.observe(el);
            }
        });
    };

    window.refreshScrollAnimations();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('YonNana Website Initialized');

    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu when a link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            });
        });
    }
});


