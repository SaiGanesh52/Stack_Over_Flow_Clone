function getCsrfToken() {
  const cookie = document.cookie.split(';').find(
    c => c.trim().startsWith('csrftoken=')
  );
  return cookie ? cookie.split('=')[1] : '';
}


function initVoting() {
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      if (this.dataset.loading) return;

      const contentType = this.dataset.type;
      const objectId = this.dataset.id;
      const value = parseInt(this.dataset.value);

      this.dataset.loading = '1';

      const voteCell = this.closest('.vote-cell');
      voteCell.classList.add('loading');

      try {
        const res = await fetch(
          `/votes/${contentType}/${objectId}/${value}/`,
          {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCsrfToken(),
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );

        const data = await res.json();

        if (!res.ok || data.error) {
          showToast(data.error || 'Could not vote.', 'error');
          return;
        }

        const countEl =
          voteCell.querySelector('.vote-count-display');

        if (countEl) {
          countEl.textContent = data.vote_count;
        }

        const upBtn =
          voteCell.querySelector('.vote-btn[data-value="1"]');

        const downBtn =
          voteCell.querySelector('.vote-btn[data-value="-1"]');

        if (upBtn) {
          upBtn.classList.remove('voted-up');
        }

        if (downBtn) {
          downBtn.classList.remove('voted-down');
        }

        if (data.user_vote === 1 && upBtn) {
          upBtn.classList.add('voted-up');
        }

        if (data.user_vote === -1 && downBtn) {
          downBtn.classList.add('voted-down');
        }

      } catch (e) {
        showToast(
          'Failed to vote. Please try again.',
          'error'
        );
      } finally {
        delete this.dataset.loading;
        voteCell.classList.remove('loading');
      }
    });
  });
}


function initBookmark() {
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const qId = this.dataset.id;

      try {
        const res = await fetch(`/questions/${qId}/bookmark/`, {
          method: 'GET',
          headers: {
            'X-CSRFToken': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        const data = await res.json();

        const label = this.querySelector('.bookmark-label');

        if (data.bookmarked) {
          this.classList.add('active');
          this.title = 'Remove from saved questions';

          if (label) {
            label.textContent = 'Saved';
          }

          showToast('Question saved!', 'success');
        } else {
          this.classList.remove('active');
          this.title = 'Save this question';

          if (label) {
            label.textContent = 'Save';
          }

          showToast(
            'Question removed from saved items.',
            'info'
          );
        }

      } catch (e) {
        showToast(
          'Could not update saved question.',
          'error'
        );
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initVoting();
  initBookmark();
});