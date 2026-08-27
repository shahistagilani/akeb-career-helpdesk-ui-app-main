name: Rotate Auth Token

on:
  schedule:
    - cron: '0 3 */10 * *'   # every 10 days, buffer before 14-day expiry
  workflow_dispatch: {}       # manual trigger button, for testing

permissions:
  contents: read

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Request new token
        id: rotate
        env:
          AUTH_PROVIDER_USERNAME: ${{ secrets.AUTH_PROVIDER_USERNAME }}
          AUTH_PROVIDER_PASSWORD: ${{ secrets.AUTH_PROVIDER_PASSWORD }}
        run: bash scripts/rotate_auth_token.sh

      - name: Update repository secret
        env:
          GH_TOKEN: ${{ secrets.GH_PAT_FOR_SECRET_UPDATE }}
        run: |
          echo "${{ steps.rotate.outputs.basic_auth_value }}" | gh secret set AUTH_HEADER_VALUE --repo "${{ github.repository }}"
