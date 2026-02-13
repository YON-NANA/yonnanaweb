# フォーム送信機能の設定手順（Googleスプレッドシート連携）

ヨンナナWebサイトの各フォーム（里親申し込み、保護依頼、ご支援）から送信されたデータを、Googleスプレッドシートで自動集計するための設定手順です。

## 手順 1: Googleスプレッドシートの作成

1. Googleドライブを開き、「新規」>「Google スプレッドシート」を作成します。
2. スプレッドシートの名前を「**ヨンナナWebサイト受信データ**」などに設定します。
3. シート（タブ）の名前を以下のように変更・追加します：
   - シート1の名前を `foster` に変更（里親申し込み用）
   - 新しいシートを追加し、名前を `inquiry` に変更（お問い合わせ・保護依頼用）
   - 新しいシートを追加し、名前を `support` に変更（支援申し込み用）
4. 各シートの1行目に、保存したい項目名を入力します（例：日時, お名前, メールアドレス, 内容 など）。
   - ※自動的に列が増えるスクリプトにするため、必須ではありませんが、分かりやすくするために入力を推奨します。

## 手順 2: Google Apps Script (GAS) の設定

1. スプレッドシートのメニューから「拡張機能」>「Apps Script」を選択します。
2. コードエディタが開くので、既存のコードを削除し、以下のコードをコピペします。

```javascript
/* 
 * フォーム受信スクリプト
 * 
 * 設定方法:
 * 1. このスクリプトを貼り付ける
 * 2. 「デプロイ」 > 「新しいデプロイ」
 * 3. 種類の選択: 「ウェブアプリ」
 * 4. 説明: 「フォーム受信」など
 * 5. 次のユーザーとして実行: 「自分」（そのまま）
 * 6. アクセスできるユーザー: 「全員」（重要！）
 * 7. 「デプロイ」をクリック -> アクセス承認 -> URLをコピー
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheetName || 'inquiry'; // デフォルトはinquiryシート
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // シートが無ければ作成
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // 1行目にヘッダーを追加（送信されたキーを使う）
      const headers = ['Timestamp', ...Object.keys(data).filter(k => k !== 'sheetName')];
      sheet.appendRow(headers);
    }
    
    // データを配列に変換
    const timestamp = new Date();
    // 既存のヘッダーに合わせてデータを並べる、もしくは単純に追加する
    // ここでは単純にオブジェクトの値を追加する簡易実装
    // ※実運用ではヘッダー行とキーをマッチングさせるのがベストですが、簡易版として値を順に追加します
    
    const rowData = [timestamp];
    // 除外するキー
    const excludeKeys = ['sheetName'];
    

    
    // オブジェクトのキー順に値を追加（順序が変わる可能性があるので、実運用ではヘッダー管理推奨）
    // 今回はフォーム側で順序付けて送信するか、スプレッドシート側で調整してください
    for (const key in data) {
      if (!excludeKeys.includes(key)) {
        rowData.push(data[key]);
      }
    }
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 手順 3: デプロイとURLの取得

1. 右上の「デプロイ」ボタン > 「新しいデプロイ」をクリック。
2. 左上の歯車アイコン > 「ウェブアプリ」を選択。
3. **アクセスできるユーザー**を「**全員**」に設定してください（これが重要です）。
4. 「デプロイ」をクリックし、Googleへのアクセス権限を承認します。
5. 表示された **ウェブアプリ URL** （`https://script.google.com/macros/s/.../exec` という形式）をコピーします。

## 手順 4: Webサイトへの反映

1. 取得したURLを教えてください。私がコード内の `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` をそのURLに書き換えます。
   - または、ご自身で `foster_apply.html`, `foster_inquiry.html`, `request.html`, `support.html` 内の該当箇所を書き換えてください。

以上で、フォームから送信された内容が自動的にスプレッドシートに蓄積されるようになります。
