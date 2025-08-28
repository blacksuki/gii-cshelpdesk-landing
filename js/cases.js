/* Case studies infinite scroll (mock data) */
(function () {
    'use strict';

    var mockCases = [
        { avatar: '', name: 'Alex Morgan', store: 'northpeak.myshopify.com', industry: 'Outdoor Gear', improvement: 'Replies are clearer and more accurate; customers understand next steps without follow-ups.', feedback: 'A customer wrote in about a delayed tent delivery during a storm. The AI pulled the tracking, clarified the carrier exception, and suggested a warm tone with a voucher. The customer replied “Thanks for the precise update—exactly what I needed.”' },
        { avatar: '', name: 'Priya Singh', store: 'urbanloom.myshopify.com', industry: 'Home Decor', improvement: 'Quality improved noticeably; important details from long emails are summarized precisely.', feedback: 'We got a 4-paragraph return request about the wrong curtain length. The draft identified the measurement issue, linked the right size, and offered a prepaid label. Customer re-ordered immediately.' },
        { avatar: '', name: 'Diego Ramos', store: 'coastlinegear.myshopify.com', industry: 'Sporting Goods', improvement: 'Agent capability uplift; tricky warranty questions are handled with confidence.', feedback: 'A surf leash snapped after 5 uses. The AI surfaced warranty terms and suggested a replacement script with empathy. No escalation needed—customer praised the “professional handling.”' },
        { avatar: '', name: 'Emily Chen', store: 'lumostudio.myshopify.com', industry: 'Lighting', improvement: 'Onboarding is lightweight; new agents respond like seasoned staff from day one.', feedback: 'New hire handled a dimmer compatibility case with a polished explanation and product link the AI provided. The customer purchased an additional adapter right away.' },
        { avatar: '', name: 'Noah Lee', store: 'evertrail.myshopify.com', industry: 'Apparel', improvement: 'Response time feels much faster; the inbox stays under control even on promo days.', feedback: 'During a flash sale, order-change requests spiked. The AI proposed concise templates and inserted exact order items automatically. We kept SLAs comfortably.' },
        { avatar: '', name: 'Sofia Rossi', store: 'verdehome.myshopify.com', industry: 'Furniture', improvement: 'Complex cases are untangled with accurate policy references and timelines.', feedback: 'A sofa delivery had two carriers and split tracking. The suggested reply stitched steps together and set clear expectations. Customer left a “super organized” comment.' },
        { avatar: '', name: 'Oliver Brown', store: 'skylinegear.myshopify.com', industry: 'Accessories', improvement: 'Email tone sounds professional and on-brand with minimal edits needed.', feedback: 'We had a frustrated customer about a missed gift wrap. The AI draft balanced apology with a quick fix and a small credit. The customer updated their review to positive.' },
        { avatar: '', name: 'Mia Johnson', store: 'auroraskin.myshopify.com', industry: 'Beauty', improvement: 'Customers frequently mention “clear answers”; satisfaction noticeably improved.', feedback: 'A skincare routine question spanned ingredients and allergies. The AI summarized routine order and flagged an ingredient concern with an alternative. Customer thanked us for the “thoughtful, safe advice.”' },
        { avatar: '', name: 'Kenji Tanaka', store: 'hirofit.myshopify.com', industry: 'Fitness', improvement: 'Trial quickly showed returns; more first-time buyers come back again.', feedback: 'A new buyer asked about resistance band levels. The draft mapped levels to goals and linked a starter set. Two weeks later, they returned for additional gear.' },
        { avatar: '', name: 'Ava Thompson', store: 'petkind.myshopify.com', industry: 'Pet Supplies', improvement: 'Back-and-forth is reduced; questions get resolved in a single, thorough reply.', feedback: 'A customer worried about puppy digestion with a new kibble. The AI suggested a gentle transition schedule and return option. They stayed with us and subscribed.' },
        { avatar: '', name: 'Lucas Martin', store: 'brewhaus.myshopify.com', industry: 'Kitchenware', improvement: 'Real-time coaching lifts agent skills; complex requests feel straightforward.', feedback: 'A buyer asked about pour-over ratios and grinder sizes. The AI offered concise brewing tips and linked our guide. The customer shared the email on social.' },
        { avatar: '', name: 'Hannah Wilson', store: 'littlelark.myshopify.com', industry: 'Kids Apparel', improvement: 'We no longer rely on heavy scripts; consistency stays high naturally.', feedback: 'Sizing concerns were addressed with a calm tone and exact measurements pulled from the product page. The parent ordered two sizes and kept one—no ticket reopened.' },
        { avatar: '', name: 'Marco Silva', store: 'ridecraft.myshopify.com', industry: 'Cycling', improvement: 'Inbox is cleared more smoothly; agents spend time on value-add tasks.', feedback: 'Shipping address changes are handled in one go with correct cutoffs. A rider said it was the “fastest fix before a race day.”' },
        { avatar: '', name: 'Grace Park', store: 'plantnest.myshopify.com', industry: 'Gardening', improvement: 'Shipping policy snippets are inserted accurately; fewer misunderstandings.', feedback: 'A plant arrived stressed due to cold weather. The AI suggested care steps and our cold-pack policy, turning a potential return into a happy follow-up photo.' },
        { avatar: '', name: 'Yuki Sato', store: 'paperstudio.myshopify.com', industry: 'Stationery', improvement: 'Replies are concise and polished; customers compliment our professionalism.', feedback: 'A custom invitation timeline was explained with milestones and a proofing schedule. The couple said the plan “removed all our worries.”' },
        { avatar: '', name: 'Ethan Clark', store: 'soundlane.myshopify.com', industry: 'Audio', improvement: 'First-response accuracy improved; fewer corrections are needed later.', feedback: 'A return was requested for “muddy sound.” The AI recommended an EQ tweak + placement tips before return, which solved it entirely and kept the sale.' },
        { avatar: '', name: 'Nora Patel', store: 'purelinen.myshopify.com', industry: 'Textiles', improvement: 'Agent confidence is higher; escalations are uncommon now.', feedback: 'A stain question triggered a gentle-care guide and warranty note. Customer followed steps and saved the product—then bought a second set.' },
        { avatar: '', name: 'Jonas Weber', store: 'mountmug.myshopify.com', industry: 'Drinkware', improvement: 'We onboard without long training; quality remains consistently high.', feedback: 'Seasonal temp staff handled a personalization typo by offering a rapid remake route the AI suggested. The gift arrived in time.' },
        { avatar: '', name: 'Layla Ahmed', store: 'desertbloom.myshopify.com', industry: 'Skincare', improvement: 'Queues move briskly; reply times feel reliably fast to customers.', feedback: 'A holiday surge brought duplicate emails. The AI merged context and replied once with a clear resolution, preventing confusion.' },
        { avatar: '', name: 'Arjun Mehta', store: 'techspares.myshopify.com', industry: 'Electronics', improvement: 'Edge cases get resolved with the right order and refund context.', feedback: 'A customer mixed up RMA steps. The draft listed exact steps with labels and a prepaid link. They followed it exactly—no follow-up needed.' },
        { avatar: '', name: 'Camila Torres', store: 'bloomcraft.myshopify.com', industry: 'Arts & Crafts', improvement: 'Brand voice is preserved; emails read friendly yet professional.', feedback: 'A craft kit missed a piece. The AI suggested a cheerful apology and a quick replacement. The customer posted a kind unboxing update.' },
        { avatar: '', name: 'George Hall', store: 'trailpaws.myshopify.com', industry: 'Pet Gear', improvement: 'Post-purchase questions are handled cleanly; fewer “where is my order” loops.', feedback: 'For a carrier delay, we sent proactive tracking + carrier notice explanation. The customer felt “kept in the loop” and stayed positive.' },
        { avatar: '', name: 'Isabella Rossi', store: 'pastaria.myshopify.com', industry: 'Gourmet Food', improvement: 'New customers are more likely to return after clear, friendly replies.', feedback: 'A sauce arrived with a broken seal. The AI offered a fast replacement and safe handling guidance. They reordered a gift bundle later.' },
        { avatar: '', name: 'Mateo Garcia', store: 'sunframe.myshopify.com', industry: 'Eyewear', improvement: 'Accuracy and speed feel better; returns and exchanges are smoother.', feedback: 'Fit questions were answered with lens width suggestions and a try-at-home option. The buyer kept the first pick.' },
        { avatar: '', name: 'Sophia Nguyen', store: 'calmhome.myshopify.com', industry: 'Wellness', improvement: 'Agents handle complex cases correctly with steady guidance.', feedback: 'A gift subscription needed to start a month later. The draft explained how we can delay activation and included the steps. The gifter praised the clarity.' },
        { avatar: '', name: 'Benjamin Lee', store: 'bytebud.myshopify.com', industry: 'Gadgets', improvement: 'Less manual policy lookup; answers include exactly what matters.', feedback: 'International adapter confusion was solved with a short compatibility table and links. The customer said the reply “saved me time.”' },
        { avatar: '', name: 'Olivia King', store: 'linenlane.myshopify.com', industry: 'Home Goods', improvement: 'Satisfaction improved and repeat purchases followed clearer guidance.', feedback: 'Care instructions were added to the return acceptance email, and the customer later bought a larger size.' },
        { avatar: '', name: 'Samuel Brooks', store: 'brewcozy.myshopify.com', industry: 'Coffee', improvement: 'Agents ramp faster; we avoid long playbooks.', feedback: 'A grinder jam report got a simple fix + video link in our draft. The customer fixed it and left a five-star comment.' },
        { avatar: '', name: 'Chloe Baker', store: 'petpalette.myshopify.com', industry: 'Pet Care', improvement: 'Fewer follow-ups and visibly faster first replies.', feedback: 'We answered a subscription skip request with a one-click manage link and confirmed the new date. No further messages.' },
        { avatar: '', name: 'Chen Wei', store: 'silkroadtea.myshopify.com', industry: 'Tea', improvement: 'International shipping clarifications are given accurately and politely.', feedback: 'A customer confused customs fees with our price. The AI explained duties/taxes expectations and provided a local tip. They still completed the purchase.' }
    ];

    var nextIndex = 0;
    var isLoading = false;

    function maskNameToken(token) {
        if (!token) return token;
        var len = token.length;
        if (len <= 2) {
            return token[0] + '*';
        }
        if (len <= 4) {
            var start2 = token.slice(0, 2);
            var stars = new Array(len - 2 + 1).join('*');
            return start2 + stars;
        }
        var start = token.slice(0, 2);
        var end = token.slice(-2);
        var middleStars = new Array(len - 4 + 1).join('*');
        return start + middleStars + end;
    }

    function maskName(name) {
        if (!name) return name;
        var parts = name.split(' ');
        return parts.map(function (part, idx) {
            var len = part.length;
            if (len === 0) return part;
            // First token: keep first 2, then '**'
            if (idx === 0) {
                if (len <= 2) return part + '**';
                return part.slice(0, 2) + '**';
            }
            // Subsequent tokens: '**' + first2 + last2
            if (len <= 2) return '**' + part;
            if (len === 3) return '**' + part.slice(0, 1) + part.slice(-1);
            return '**' + part.slice(0, 2) + part.slice(-2);
        }).join(' ');
    }

    function maskSubdomain(sub) {
        if (!sub) return sub;
        var len = sub.length;
        if (len <= 3) {
            return sub[0] + '**';
        }
        var keepStart = Math.min(3, len - 2);
        var keepEnd = Math.min(2, len - keepStart);
        var start = sub.slice(0, keepStart);
        var end = sub.slice(len - keepEnd);
        var stars = new Array(len - keepStart - keepEnd + 1).join('*');
        return start + stars + end;
    }

    function maskStoreDomain(store) {
        if (!store) return store;
        var parts = store.split('.');
        if (parts.length >= 1) {
            parts[0] = maskSubdomain(parts[0]);
        }
        return parts.join('.');
    }

    function createCard(item) {
        var article = document.createElement('article');
        article.className = 'case-card';

        var avatar = document.createElement('div');
        avatar.className = 'case-card__avatar';
        avatar.setAttribute('aria-hidden', 'true');

        var content = document.createElement('div');

        var title = document.createElement('h3');
        title.className = 'case-card__title';
        title.textContent = maskName(item.name) + ' — ' + maskStoreDomain(item.store);

        var badge = document.createElement('span');
        badge.className = 'case-card__meta';
        badge.style.display = 'inline-block';
        badge.style.marginTop = '4px';
        badge.style.background = '#f3f6fc';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '999px';
        badge.textContent = item.industry;

        var quote = document.createElement('p');
        quote.className = 'case-card__meta';
        quote.style.marginTop = '6px';
        quote.textContent = '“' + item.improvement + ' ' + item.feedback + '”';

        content.appendChild(title);
        content.appendChild(badge);
        content.appendChild(quote);

        article.appendChild(avatar);
        article.appendChild(content);

        return article;
    }

    function loadMore(targetContainer, count) {
        if (isLoading) return;
        isLoading = true;
        var appended = 0;
        while (appended < count && nextIndex < mockCases.length) {
            targetContainer.appendChild(createCard(mockCases[nextIndex]));
            nextIndex++;
            appended++;
        }
        // small defer to avoid rapid multiple triggers
        setTimeout(function(){ isLoading = false; }, 200);
    }

    function setupInfiniteScroll() {
        var grid = document.getElementById('cases-grid');
        var sentinel = document.getElementById('cases-sentinel');
        if (!grid || !sentinel) return;

        // initial batch (3–4)
        var initialCount = 3 + Math.floor(Math.random() * 2); // 3 or 4
        loadMore(grid, initialCount);

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var batch = 3 + Math.floor(Math.random() * 2); // 3 or 4
                    loadMore(grid, batch);
                }
            });
        }, { rootMargin: '200px 0px' });

        io.observe(sentinel);
    }

    document.addEventListener('DOMContentLoaded', setupInfiniteScroll);
})();


