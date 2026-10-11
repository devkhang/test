# Ghi chép hỏi đáp: thư mục `api`, thư viện `@vna/lib` và cấu hình môi trường

Tài liệu này tổng hợp các câu hỏi về dự án `@vna/client-ccvc` (Next.js) theo đúng thứ tự đã hỏi. Mỗi câu có câu trả lời đầy đủ, kèm code minh họa và tài liệu đọc thêm.

> Phiên bản thư viện được phân tích: `@vna/lib@1.7.2`.
> Code của thư viện đã được minify. Các đoạn "bản dễ đọc" trong tài liệu được viết lại cho dễ hiểu nhưng giữ nguyên logic.

---

## Mục lục

1. [Thư mục `api` trong `node_modules`?](#1-thư-mục-api-trong-node_modules)
2. [`@vna/lib` là gì?](#2-vnalib-là-gì)
3. [Instance axios được tạo ở đâu?](#3-instance-axios-được-tạo-ở-đâu)
4. [Constructor trong `.d.ts` khác constructor trong `.js`?](#4-constructor-trong-dts-khác-constructor-trong-js)
5. [Giải thích constructor của `BaseApi` từng dòng](#5-giải-thích-constructor-của-baseapi-từng-dòng)
6. [`BaseApi.d.ts` và `BaseApi.js` có phải là một?](#6-baseapidts-và-baseapijs-có-phải-là-một)
7. [`baseURL` và `url` khác nhau thế nào?](#7-baseurl-và-url-khác-nhau-thế-nào)
8. [`window` là đối tượng gì?](#8-window-là-đối-tượng-gì)
9. [`process.env.tenant` nằm ở file nào?](#9-processenvtenant-nằm-ở-file-nào)
10. [`env` do Next.js "tạo ra" nghĩa là sao?](#10-env-do-nextjs-tạo-ra-nghĩa-là-sao)
11. [Tenant là gì?](#11-tenant-là-gì)
12. [Mỗi frontend khác nhau có phải là một tenant?](#12-mỗi-frontend-khác-nhau-có-phải-là-một-tenant)
13. ["Tách biệt dữ liệu" nghĩa là gì?](#13-tách-biệt-dữ-liệu-nghĩa-là-gì)
14. [`env` trong `next.config.js` khác gì file `.env`?](#14-env-trong-nextconfigjs-khác-gì-file-env)
15. [Các method của `BaseApi` hoạt động thế nào?](#15-các-method-của-baseapi-hoạt-động-thế-nào)
16. [Interceptor trong axios hoạt động thế nào?](#16-interceptor-trong-axios-hoạt-động-thế-nào)
17. [`BaseApi.js` chứa gì?](#17-baseapijs-chứa-gì)
18. [`___$insertStyle` là hàm gì?](#18-___insertstyle-là-hàm-gì)
19. [`index.js` chứa gì?](#19-indexjs-chứa-gì)
20. [`useReducer.js` chứa gì?](#20-usereducerjs-chứa-gì)
21. [Hiểu `useReducer` từ đầu, kèm ví dụ dễ hiểu](#21-hiểu-usereducer-từ-đầu-kèm-ví-dụ-dễ-hiểu)
22. [Tổng hợp các điểm cần lưu ý](#22-tổng-hợp-các-điểm-cần-lưu-ý)
23. [Tài liệu học thêm](#23-tài-liệu-học-thêm)

---

## 1. Thư mục `api` trong `node_modules`?

**Trả lời ngắn:** trong dự án này, `node_modules` **không có** thư mục `api` nào. Thư mục `api` mà code import tới là thư mục **`api/` ở thư mục gốc dự án**.

### Vì sao dễ nhầm

Code import như sau:

```ts
import Province from "api/Province";
```

Đường dẫn không bắt đầu bằng `./` nên trông giống một package trong `node_modules`. Thực ra `tsconfig.json` có:

```json
"baseUrl": "."
```

Vì vậy TypeScript và Next.js tìm `api/...` **tính từ thư mục gốc**, tức là `./api/Province.ts`. Các import `services/...` và `logic/...` cũng hoạt động theo cách này.

### Thư mục `api/` dùng làm gì

Đây là **lớp gọi API backend**. Mỗi file ứng với một nhóm endpoint:

- `api/Base.ts` là lớp cha. Nó kế thừa `commons.BaseApi` từ `@vna/lib` và đặt `timeout: 5000`.
- Các file khác (`Province.ts`, `Profile.ts`, `Year.ts`, `Users.ts`, `Auth.ts`, `Form.ts`…) đều viết theo cùng một mẫu:

```ts
import Base from "./Base";

class Province extends Base {
  constructor() {
    super({ url: "province" });            // endpoint gốc
  }
  async getDistrict(provinceId: any) {     // endpoint bổ sung
    return this.execute({ url: `province/${provinceId}/district`, method: "get" });
  }
}
export default new Province();             // export sẵn một instance
```

Ngoài ra còn có `services/api.service.ts`, một cách gọi API khác (dùng `fetch`/`axios`), nhưng chỉ được dùng ở rất ít chỗ.

---

## 2. `@vna/lib` là gì?

`@vna/lib` là **thư viện nội bộ** của nhóm phát triển, có cùng tác giả với dự án. Nó được publish lên **GitLab Package Registry riêng**, không có trên npmjs.com. Gói rất nhỏ, khoảng 20 KB với 21 file, và được build bằng Rollup.

### Cấu trúc

```
dist/
├── index.js                 → export default: commons, components
├── commons/
│   ├── BaseApi.js           → lớp gọi API (axios)
│   ├── useReducer.js        → hook quản lý state
│   └── utils.js             → hàm tiện ích
└── components/
    ├── Loading.js           → khung loading
    └── tables/CommonTable.js → bảng dữ liệu
```

### Các thành phần

| Thành phần | Chức năng | Dùng trong dự án |
|---|---|---|
| `BaseApi` | Lớp gọi API: tự gắn token và tenant, có sẵn CRUD | Là lớp cha của `api/Base.ts` |
| `useReducer` | Hook quản lý state, cho phép reducer async | 39 file |
| `utils.convertDateToString` | Định dạng ngày `DD/MM/YYYY` | 8 file |
| `utils.isPassword` | Kiểm tra mật khẩu 8–20 ký tự, có chữ hoa, chữ thường, số | |
| `utils.uuidv4`, `setGlobal`, `getGlobal` | Tiện ích khác. ⚠️ `getGlobal` bị lỗi vì thiếu `return` nên luôn trả `undefined` | |
| `Loading` | Lớp phủ có vòng xoay khi `loading={true}` | Nhiều trang |
| `CommonTable` | Bảng có `columns`/`rows`, sắp xếp, phân trang | Nhiều trang |

### ⚠️ Lưu ý bảo mật

File `.npmrc` trong repo đang chứa **token thật của GitLab registry** (`_authToken=...`) và đã được commit. Ai đọc được repo cũng tải được gói này. Nên làm các việc sau:

1. Báo người quản lý GitLab **thu hồi token đó**.
2. Chuyển sang dùng biến môi trường: `_authToken=${NPM_TOKEN}`.
3. Bỏ token thật khỏi git.

---

## 3. Instance axios được tạo ở đâu?

Instance axios được tạo trong **constructor của `BaseApi`**, nằm trong file:

```
node_modules/@vna/lib/dist/commons/BaseApi.js
```

Dòng tạo instance:

```js
this.api = axios.create({ baseURL, timeout });
```

### Constructor chạy khi nào

```
api/Province.ts:  export default new Province()
        → Base (api/Base.ts, thêm timeout: 5000)
        → BaseApi constructor
        → axios.create(...)
```

**Mỗi file trong `api/` có một instance axios riêng**, được tạo **đúng một lần**, vào lần đầu module đó được import.

### `process.env.apiUrl` lấy từ đâu

Giá trị này đến từ `next.config.js`:

```js
env: {
  apiUrl: process.env.NEXT_PUBLIC_TENANT === "ncc"
    ? process.env.NEXT_PUBLIC_NCC_API_URL
    : process.env.NEXT_PUBLIC_API_URL,
  tenant: process.env.NEXT_PUBLIC_TENANT,
}
```

### ⚠️ Hệ quả

Token chỉ được đọc **một lần trong constructor**. Nếu instance được tạo trước khi người dùng đăng nhập, request sẽ không có header `Authorization` cho tới khi tải lại trang.

---

## 4. Constructor trong `.d.ts` khác constructor trong `.js`?

Trong `BaseApi.d.ts`, bạn thấy dòng:

```ts
constructor({ baseURL, url, headers, timeout, setResponse, setError, }: ApiConfig);
```

Dòng này **chỉ là khai báo kiểu**: nó kết thúc bằng `;` và không có phần thân `{ ... }`. **Code thật** nằm trong `BaseApi.js` và đã bị minify:

```js
function t(t){var r=t.baseURL,s=void 0===r?process.env.apiUrl:r, ... this.api=u.default.create({baseURL:s,timeout:h}) ...}
```

Các tham số trong `.d.ts` (`baseURL`, `url`, `headers`, `timeout`, `setResponse`, `setError`) khớp đúng với những gì code `.js` lấy ra từ `t.baseURL`, `t.url`…

---

## 5. Giải thích constructor của `BaseApi` từng dòng

```js
function t(t){
  var r=t.baseURL, s=void 0===r?process.env.apiUrl:r,
      a=t.url, i=t.headers, n=void 0===i?{}:i,
      d=t.timeout, h=void 0===d?5e3:d,
      l=t.setResponse, p=t.setError;
  if(this.url=a, this.headers=n, "undefined"!=typeof window){
    var c=window.localStorage.getItem("token");
    c&&(this.headers.Authorization="Bearer "+JSON.parse(c))
  }
  var f=process.env.tenant;
  f&&(this.headers["x-forward-tenant"]=f),
  this.api=u.default.create({baseURL:s,timeout:h}),
  this.api.interceptors.response.use(...)
}
```

| Dòng | Giải thích |
|---|---|
| `function t(t){` | Constructor đã bị đổi tên thành `t`. Tham số `t` là **object cấu hình** truyền vào `super({...})` |
| `r=t.baseURL, s=void 0===r?process.env.apiUrl:r` | `void 0` là `undefined`. Nếu không truyền `baseURL` thì dùng `process.env.apiUrl` |
| `a=t.url, i=t.headers, n=void 0===i?{}:i` | Lấy endpoint. Nếu không có headers thì dùng `{}` |
| `d=t.timeout, h=void 0===d?5e3:d` | `5e3` = 5000. Timeout mặc định là 5 giây |
| `l=t.setResponse, p=t.setError` | Hai hàm tùy chọn để tự xử lý response và lỗi. Dự án không dùng |
| `if(this.url=a, this.headers=n, "undefined"!=typeof window){` | **Toán tử dấu phẩy**: chạy lần lượt `this.url = a`, `this.headers = n` (gọi setter, lưu vào `_headers`), rồi mới xét điều kiện `typeof window !== "undefined"`, tức là chỉ chạy ở trình duyệt |
| `var c=window.localStorage.getItem("token")` | Đọc token. Token được lưu bằng `JSON.stringify` (`src/hooks/useLocalStorage.ts`) |
| `c&&(this.headers.Authorization="Bearer "+JSON.parse(c))` | `c && (...)` tương đương `if (c) {...}`. `JSON.parse` bỏ dấu nháy để lấy lại token gốc |
| `var f=process.env.tenant` | Mã tenant lấy từ `NEXT_PUBLIC_TENANT` |
| `f&&(this.headers["x-forward-tenant"]=f)` | Có tenant thì thêm header `x-forward-tenant` |
| `this.api=u.default.create({baseURL:s,timeout:h})` | `u.default` chính là `axios`. Tạo instance riêng. **Headers không được truyền ở đây**, chúng được ghép vào từng request trong `execute` |
| `this.api.interceptors.response.use(...)` | Cài interceptor. Xem [mục 16](#16-interceptor-trong-axios-hoạt-động-thế-nào) |

### Bản dễ đọc

```js
constructor({ baseURL = process.env.apiUrl, url, headers = {}, timeout = 5000, setResponse, setError }) {
  this.url = url;
  this.headers = headers;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) this.headers.Authorization = "Bearer " + JSON.parse(token);
  }

  if (process.env.tenant) this.headers["x-forward-tenant"] = process.env.tenant;

  this.api = axios.create({ baseURL, timeout });

  this.api.interceptors.response.use(
    (res) => (setResponse ? setResponse(res) : res.data),
    (err) => {
      const body = _.get(err, "response.data", {});
      throw setError ? setError(err) : { ...body, message: _.get(body, "errors.message", body.message || "") };
    }
  );
}
```

---

## 6. `BaseApi.d.ts` và `BaseApi.js` có phải là một?

**Không phải cùng một file**, nhưng chúng **mô tả cùng một lớp `BaseApi`**. Cả hai được build ra từ **cùng một file nguồn** `BaseApi.ts`, và file nguồn này không có trong gói npm.

```
BaseApi.ts (nguồn, không có trong node_modules)
        │  npm run build (rollup + typescript)
        ├──► BaseApi.js    = CODE (logic chạy thật), đã minify
        └──► BaseApi.d.ts  = KIỂU (chữ ký hàm), không có logic
```

| | `BaseApi.js` | `BaseApi.d.ts` |
|---|---|---|
| Chứa | Thân hàm | Chỉ khai báo kiểu |
| Ai dùng | Trình duyệt / Node khi **chạy** | TypeScript và VS Code khi **viết code** |
| Xóa đi thì sao | App crash | App vẫn chạy, nhưng mất gợi ý kiểu |

So sánh với C/C++: `.d.ts` giống file header `.h`, còn `.js` giống file `.c`.

Khi `import commons from "@vna/lib"`:

- **TypeScript** đọc `dist/index.d.ts` (trường `"types"` trong package.json).
- **Webpack/Next.js** đóng gói `dist/index.js` (trường `"main"`).

---

## 7. `baseURL` và `url` khác nhau thế nào?

```
https://api.example.com/  +  province  =  https://api.example.com/province
└────── baseURL ────────┘    └─ url ─┘
```

| | `baseURL` | `url` |
|---|---|---|
| Ý nghĩa | **Địa chỉ server** | **Đường dẫn tài nguyên** trên server |
| Giá trị | `process.env.apiUrl` | `"province"`, `"views"`, `"users"`… |
| Ai truyền | Không file nào, nên dùng giá trị mặc định | Mỗi file `api/*.ts` qua `super({ url })` |
| Lưu ở đâu | Trong `axios.create({ baseURL })` | `this.url`, dùng trong các hàm CRUD |
| Khi đổi môi trường | Thay đổi | Giữ nguyên |

### Ví dụ với `Province` (`url = "province"`)

| Gọi | Gửi tới |
|---|---|
| `Province.get()` | `{baseURL}/province` |
| `Province.getDetail(5)` | `{baseURL}/province/5` |
| `Province.getDistrict(1)` | `{baseURL}/province/1/district` |

**Trường hợp đặc biệt:** nếu `url` là địa chỉ đầy đủ (`http://...`), axios **bỏ qua `baseURL`**. `api/View.ts` (hàm `getData`) và `api/Doet.ts` gọi `axios` trực tiếp với `process.env.apiUrl + path`. Các request này **không đi qua interceptor** của `BaseApi`, và token phải truyền vào bằng tay.

---

## 8. `window` là đối tượng gì?

`window` là **đối tượng toàn cục mà trình duyệt cung cấp**. Nó đại diện cho cửa sổ hoặc tab hiện tại. **Chỉ trình duyệt mới có `window`**, Node.js thì không.

| Thuộc tính / hàm | Dùng để |
|---|---|
| `window.localStorage` | Lưu dữ liệu lâu dài. Dự án lưu `token` ở đây |
| `window.sessionStorage` | Giống `localStorage` nhưng bị xóa khi đóng tab |
| `window.document` | Cây HTML (DOM) |
| `window.location` | URL, chuyển trang |
| `window.alert()`, `fetch()`, `setTimeout()` | Hộp thoại, gọi mạng, hẹn giờ |

Có thể bỏ chữ `window.`: `localStorage.getItem(...)` và `window.localStorage.getItem(...)` là một.

### Vì sao `BaseApi` phải kiểm tra `typeof window`

Next.js chạy code ở **hai nơi**:

| Nơi chạy | Có `window` không |
|---|---|
| Server (SSR, Node.js) | ❌ Không. Gọi `window.localStorage` sẽ lỗi `window is not defined` |
| Trình duyệt | ✅ Có |

Phải dùng `typeof window`, vì nếu viết `if (window)` trên server thì chính dòng đó đã gây lỗi.

**`globalThis`** là tên chung cho đối tượng toàn cục ở mọi môi trường: là `window` trên trình duyệt và `global` trên Node.js. Hook `useReducer` của `@vna/lib` dùng `globalThis`.

---

## 9. `process.env.tenant` nằm ở file nào?

Nó không nằm trong một file riêng. Cụ thể:

- **Khai báo** ở `next.config.js`: `tenant: process.env.NEXT_PUBLIC_TENANT`.
- **Giá trị thật** đến từ biến môi trường `NEXT_PUBLIC_TENANT`, đặt trong file `.env`.

### Nguồn giá trị `NEXT_PUBLIC_TENANT`

**Chạy ở máy cá nhân:** sao chép `.env.example` thành `.env` rồi bỏ dấu `#`:

```
# NEXT_PUBLIC_API_URL=
# NEXT_PUBLIC_NCC_API_URL=http://localhost:3333/api/v1/
# NEXT_PUBLIC_TENANT=ncc
```

**Khi deploy:** `.gitlab-ci.yml` tải file env từ **AWS S3** trước khi build Docker:

```yaml
- aws s3 cp s3://$ENV_BUCKET/$ENV_FILE .   # vna-dev-env / vna-staging-env / vna-production-env
- mv $ENV_FILE .env
- docker build ... --file ./prod.Dockerfile .
```

### Luồng giá trị

```
.env (máy local)  hoặc  S3 tts-frontend-env (CI)
        │  NEXT_PUBLIC_TENANT=ncc
        ▼
next.config.js → env.tenant = process.env.NEXT_PUBLIC_TENANT
        │  (Next.js thay giá trị lúc build)
        ▼
BaseApi.js → process.env.tenant → header "x-forward-tenant: ncc"
```

---

## 10. `env` do Next.js "tạo ra" nghĩa là sao?

Next.js **không tạo ra một object `env` lúc chạy**. Lúc build, nó **tìm và thay chữ**: mọi chỗ viết `process.env.tenant` được thay bằng giá trị thật, ví dụ `"ncc"`.

### Vì sao cần làm vậy

`process.env` là đối tượng của **Node.js**. Trình duyệt không có `process`. Next.js lấy giá trị ở **máy build** rồi ghi thẳng giá trị đó vào code gửi xuống trình duyệt.

### Ba bước khi `yarn build`

1. **Đọc `.env`** và nạp vào `process.env` của Node.js.
2. **Chạy `next.config.js`**, tính ra `{ tenant: "ncc", apiUrl: "..." }`.
3. **Webpack (`DefinePlugin`) thay chữ** trong **toàn bộ code**, kể cả `node_modules`.

### Trước và sau khi build

```js
// Trước (BaseApi.js)
var f = process.env.tenant;
this.api = axios.create({ baseURL: process.env.apiUrl, timeout: h });

// Sau (file JS gửi xuống trình duyệt)
var f = "ncc";
this.api = axios.create({ baseURL: "http://localhost:3333/api/v1/", timeout: h });
```

### Hệ quả quan trọng

1. **Giá trị bị "đóng băng" lúc build.** Sửa `.env` thì phải build lại. Mỗi môi trường cần một image Docker riêng.
2. **Chỉ cách viết đúng dạng `process.env.TEN` mới được thay:**
   ```js
   process.env.tenant                 // ✅
   const { tenant } = process.env;    // ❌ → undefined trên trình duyệt
   process.env[key]                   // ❌
   ```
3. **Giá trị nằm công khai trong file JS.** Không bao giờ đưa giá trị bí mật vào.

### `env` trong config và tiền tố `NEXT_PUBLIC_`

| Cách | Đặc điểm |
|---|---|
| `env` trong `next.config.js` | Tự đặt tên, **tính toán được** |
| Tiền tố `NEXT_PUBLIC_` trong `.env` | Tự động đưa xuống trình duyệt |
| Không có tiền tố, không khai báo | Chỉ dùng được ở server |

---

## 11. Tenant là gì?

**Tenant** (nghĩa gốc là "người thuê nhà") là **một khách hàng hoặc đơn vị dùng chung một hệ thống phần mềm, nhưng dữ liệu được tách riêng**. Kiến trúc này được gọi là **multi-tenant**.

| Chung cư | Phần mềm |
|---|---|
| Tòa nhà dùng chung | Một bộ code, một server |
| Mỗi căn hộ | Mỗi **tenant** |
| Chìa khóa riêng | Mã tenant |
| Nhà A không vào được nhà B | Tenant A không thấy dữ liệu tenant B |

Ví dụ ngoài đời: Gmail doanh nghiệp, Slack, Shopify.

### Lợi ích

- Chỉ cần một bộ code để phát triển và bảo trì.
- Tiết kiệm hạ tầng.
- Mỗi tenant vẫn có thể có cấu hình riêng.

### Cách backend phân biệt tenant

1. **Header**, ví dụ `x-forward-tenant: ncc`. Dự án này dùng cách này.
2. **Subdomain**, ví dụ `ncc.app.com`.
3. **Mã tenant nằm trong token** đăng nhập.

### Trong dự án

- `BaseApi` gắn `x-forward-tenant: <tenant>` vào **mọi request**.
- Tenant `ncc` dùng **URL API riêng** (`NEXT_PUBLIC_NCC_API_URL`).
- `services/aws/aws.service.ts` gọi `https://core-tenant-dev.vnaapi.com/`, gợi ý rằng có một dịch vụ "core-tenant" dùng chung.

---

## 12. Mỗi frontend khác nhau có phải là một tenant?

**Không hẳn.** Tenant là khái niệm về **khách hàng và dữ liệu**, không phải về frontend.

### Ba kiểu ghép

1. **Một code, build nhiều lần, mỗi bản là một tenant.** Dự án này thuộc kiểu này, vì tenant bị ghi cứng lúc build.
   ```
   Cùng repo ──build TENANT=ncc──► bản A → tenant "ncc"
             ──build TENANT=xyz──► bản B → tenant "xyz"
   ```
2. **Một frontend phục vụ nhiều tenant cùng lúc**, dựa vào subdomain hoặc tài khoản đăng nhập. Dự án hiện tại **không** làm được như vậy.
3. **Nhiều frontend dùng chung một tenant**, ví dụ trang admin, trang cho người dân và app mobile cùng gửi `ncc`.

### Đừng nhầm tenant với môi trường

| | Tenant | Môi trường |
|---|---|---|
| Trả lời câu hỏi | Dữ liệu của **ai**? | Bản **thử** hay bản **thật**? |
| Ví dụ | `ncc`, `xyz` | dev, staging, production |
| Trong dự án | `NEXT_PUBLIC_TENANT` | Nhánh git + bucket S3 |

**Kết luận:** trong dự án này, **một bản deploy có một tenant**. Hai bản deploy có tenant khác nhau vẫn chung code, chỉ khác `.env` lúc build.

---

## 13. "Tách biệt dữ liệu" nghĩa là gì?

Nghĩa là **mỗi tenant chỉ đọc và ghi được dữ liệu của chính mình**. Việc tách được **thực hiện ở backend và database**. Frontend chỉ cho backend biết "tôi là tenant nào".

### Ví dụ

| Hồ sơ | Tenant |
|---|---|
| Nguyễn Văn A | ncc |
| Trần Thị B | ncc |
| Lê Văn C | xyz |

`GET /profile` kèm `x-forward-tenant: ncc` chỉ trả về A và B, **không bao giờ trả C**.

### Ba cách tách dữ liệu

1. **Mỗi tenant một database:** an toàn nhất nhưng tốn tài nguyên.
2. **Chung database, mỗi tenant một schema:** phương án ở giữa.
3. **Chung bảng, thêm cột `tenant_id`:** rẻ nhất, nhưng quên `WHERE tenant_id = ...` ở một chỗ là lộ dữ liệu.

### ⚠️ Header không phải là bảo mật

Người dùng có thể **sửa header** bằng DevTools hoặc Postman. Backend phải **kiểm tra lại** người dùng trong token có thật sự thuộc tenant đó không.

### Trong dự án

- `ncc` có URL API riêng, nên có thể dùng cách 1.
- Các tenant khác dùng chung URL và được phân biệt bằng header, nên có thể là cách 2 hoặc 3.
- Muốn biết chính xác thì cần xem code backend.

---

## 14. `env` trong `next.config.js` khác gì file `.env`?

`.env` chứa **giá trị gốc**. `env` trong `next.config.js` là **code đọc giá trị gốc, biến đổi, đặt tên mới và đưa xuống trình duyệt**.

**`.env`** chứa dữ liệu thô:

```
NEXT_PUBLIC_API_URL=https://api.example.com/
NEXT_PUBLIC_NCC_API_URL=http://localhost:3333/api/v1/
NEXT_PUBLIC_TENANT=ncc
TEMPLATE_URL=...
```

**`next.config.js`** là code:

```js
env: {
  templateUrl: process.env.TEMPLATE_URL,                  // đổi tên
  apiUrl: process.env.NEXT_PUBLIC_TENANT === "ncc"        // tính toán
    ? process.env.NEXT_PUBLIC_NCC_API_URL
    : process.env.NEXT_PUBLIC_API_URL,
  tenant: process.env.NEXT_PUBLIC_TENANT,                 // đổi tên
}
```

| | `.env` | `env` trong `next.config.js` |
|---|---|---|
| Bản chất | `KEY=value`, không có logic | Code JS, viết được `if` |
| Chứa | Giá trị thật | Cách dùng các giá trị |
| Khác nhau theo môi trường | ✅ Có | ❌ Không |
| Commit lên git | ❌ Không | ✅ Có |
| Trình duyệt thấy | Chỉ biến `NEXT_PUBLIC_*` | Mọi key khai báo ở đây |

### Vì sao dự án cần cả hai

1. Tách cấu hình khỏi code.
2. `@vna/lib` cần đúng tên `apiUrl` và `tenant`.
3. Cần logic chọn URL theo tenant.

---

## 15. Các method của `BaseApi` hoạt động thế nào?

### Getter và setter `headers`

```js
set headers(newHeader) { this._headers = newHeader; }
get headers()          { return this._headers; }
```

Đây là hàm nhưng được **dùng như thuộc tính**: `api.headers = {...}` gọi setter, còn `api.headers` gọi getter.

### `execute`: hàm gốc

```js
async execute({ url, method, params, data, headers }) {
  try {
    return await this.api({
      method, url, params, data,
      headers: { ...this.headers, ...headers },   // header chung + header riêng
    });
  } catch (err) {
    return err;          // ⚠️ trả lỗi về, không throw
  }
}
```

| Tham số | Ý nghĩa | Ví dụ |
|---|---|---|
| `url` | Đường dẫn (ghép sau `baseURL`) | `"province/1/district"` |
| `method` | HTTP method | `"get"`, `"post"`… |
| `params` | Query string | `{ page: 1 }` → `?page=1` |
| `data` | Body (JSON) | `{ name: "A" }` |
| `headers` | Header riêng cho request này | |

⚠️ **`execute` không throw lỗi**, nên `try/catch` ở chỗ gọi không bắt được. Phải kiểm tra kết quả, ví dụ `if (!res?.success) ...`.

### Các hàm CRUD (giả sử `this.url = "form"`)

| Method | Request | Dùng để |
|---|---|---|
| `get(params)` | `GET /form?...` | Lấy danh sách |
| `getDetail(id, params)` | `GET /form/5` | Lấy một bản ghi |
| `post(data)` | `POST /form` | Tạo mới |
| `put(id, data)` | `PUT /form/5` | Cập nhật |
| `delete(id)` | `DELETE /form/5` | Xóa một bản ghi |
| `destroy(id)` | `DELETE /form/destroy/5` | Xóa hẳn một bản ghi (tùy backend quy định) |
| `deletes({ ids })` | `DELETE /form/deletes` | Xóa nhiều bản ghi |
| `detroys({ ids })` | `DELETE /form/detroys` | Xóa hẳn nhiều bản ghi (tên viết sai nhưng phải khớp với backend) |

### Ví dụ thật

```ts
// logic/formManager/formManagerReducer.ts
item.id ? await Form.put(item.id, item)   // cập nhật
        : await Form.post(item);          // tạo mới

await Form.deletes({ ids: listId });      // xóa nhiều
```

Các method dùng nhiều nhất: `Profile.get` (16 lần), `Profile.put`, `List.put`, `Year.get`, `Category.get`.

**Mẹo thực hành:** mở DevTools → tab **Network** để xem method, URL, header và body của từng lần gọi.

---

## 16. Interceptor trong axios hoạt động thế nào?

Interceptor là **hàm được axios tự động gọi ở giữa đường đi của mọi request hoặc response**.

- **Request interceptor:** chạy trước khi gửi. Dùng để gắn token, thêm header, ghi log.
- **Response interceptor:** chạy sau khi nhận response. Dùng để bóc `data`, chuẩn hóa lỗi, xử lý lỗi 401.

### Luồng đi

```
await Profile.get()
      │
      ▼
[Request interceptor(s)]   ← sửa config
      │
      ▼
   Gửi HTTP ─────► Server
      ┌──────────────┘
      ▼
[Response interceptor(s)]  ← thành công: hàm 1 / lỗi: hàm 2
      │
      ▼
kết quả trả về cho `await`
```

### Cú pháp

```js
api.interceptors.request.use(
  (config) => { config.headers.X = "abc"; return config; },  // BẮT BUỘC return config
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,             // giá trị return chính là kết quả của `await`
  (error) => Promise.reject(error)
);
```

**Quy tắc:**

- Giá trị **return** ở hàm thành công sẽ là kết quả cho bước tiếp theo.
- Ở hàm lỗi: **throw/reject** thì `await` ném lỗi. **Return giá trị bình thường** thì lỗi được coi như đã xử lý.

### Bên trong axios

Axios ghép các interceptor thành **một chuỗi Promise**:

```js
let p = Promise.resolve(config);
p = p.then(reqInterceptor2.ok, reqInterceptor2.err);
p = p.then(reqInterceptor1.ok, reqInterceptor1.err);
p = p.then(dispatchRequest);              // gửi HTTP thật
p = p.then(resInterceptor1.ok, resInterceptor1.err);
p = p.then(resInterceptor2.ok, resInterceptor2.err);
```

- Request interceptor chạy **ngược thứ tự đăng ký**.
- Response interceptor chạy **đúng thứ tự đăng ký**.
- Gỡ interceptor bằng `api.interceptors.response.eject(id)`.

### Interceptor trong `BaseApi`

```js
this.api.interceptors.response.use(
  (res) => setResponse ? setResponse(res) : res.data,      // ① trả thẳng body
  (err) => {                                                // ② chuẩn hóa lỗi
    const body = _.get(err, "response.data", {});
    throw setError ? setError(err) : {
      ...body,
      message: _.get(body, "errors.message", body.message || ""),
    };
  }
);
```

- **Thành công:** `await Profile.get()` nhận thẳng `{ success, data }` mà không cần viết `.data`.
- **Lỗi:** tạo object có `message` thống nhất rồi throw. Sau đó `execute` **bắt lỗi và return**, nên chỗ gọi nhận lỗi như một giá trị bình thường.

### Ví dụ cải tiến: sửa vấn đề token cũ

```ts
// api/Base.ts (ví dụ minh họa, CHƯA áp dụng vào code)
class Base extends commons.BaseApi {
  constructor(data: any) {
    super({ ...data, timeout: 5000 });
    this.api.interceptors.request.use((config) => {
      const raw = typeof window !== "undefined" && localStorage.getItem("token");
      if (raw) config.headers.Authorization = "Bearer " + JSON.parse(raw);
      return config;
    });
  }
}
```

### Ứng dụng phổ biến

- Chuyển về trang đăng nhập khi gặp lỗi 401.
- Tự lấy token mới bằng refresh token.
- Bật/tắt loading toàn cục (`nprogress`).
- Ghi log và đo thời gian request.

---

## 17. `BaseApi.js` chứa gì?

File gồm **ba phần**:

```js
"use strict";

// PHẦN 1: Nạp thư viện
const tslib = require("../_virtual/_tslib.js"); // helper TypeScript sinh ra (__assign, __awaiter...)
const _     = require("lodash");
const axios = require("axios");

// PHẦN 2: Lớp BaseApi
class BaseApi {
  constructor({ baseURL = process.env.apiUrl, url, headers = {}, timeout = 5000,
                setResponse, setError }) { /* xem mục 5 */ }

  get headers()  { return this._headers; }
  set headers(v) { this._headers = v; }

  async execute({ url, method, params, data, headers }) {
    try {
      return await this.api({ method, url, params, data,
                              headers: { ...this.headers, ...headers } });
    } catch (e) { return e; }
  }

  get(params)          { return this.execute({ method: "get",    url: this.url, params }); }
  getDetail(id, params){ return this.execute({ method: "get",    url: `${this.url}/${id}`, params }); }
  post(data)           { return this.execute({ method: "post",   url: this.url, data }); }
  put(id, data)        { return this.execute({ method: "put",    url: `${this.url}/${id}`, data }); }
  delete(id)           { return this.execute({ method: "delete", url: `${this.url}/${id}` }); }
  destroy(id)          { return this.execute({ method: "delete", url: `${this.url}/destroy/${id}` }); }
  deletes(data)        { return this.execute({ method: "delete", url: `${this.url}/deletes`, data }); }
  detroys(data)        { return this.execute({ method: "delete", url: `${this.url}/detroys`, data }); }
}

// PHẦN 3: Xuất ra ngoài
module.exports = BaseApi;
```

### Đường đi từ file này tới code của bạn

```
BaseApi.js ──► commons/index.js (exports.BaseApi)
           ──► dist/index.js (exports.default = commons)
           ──► api/Base.ts: class Base extends commons.BaseApi
           ──► api/Province.ts: class Province extends Base → new Province()
```

**Đừng sửa trực tiếp** file trong `node_modules`, vì lần `npm install` sau sẽ ghi đè mất. Muốn thay đổi hành vi thì sửa ở `api/Base.ts`.

---

## 18. `___$insertStyle` là hàm gì?

Đây là **hàm phụ do plugin `rollup-plugin-sass` sinh ra**, dùng để **chèn CSS vào trang lúc chạy**.

```js
function ___$insertStyle(css) {
  if (!css) return;                              // không có CSS
  if (typeof window === 'undefined') return;     // đang ở server

  var style = document.createElement('style');   // tạo thẻ <style>
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;                         // đặt CSS vào
  document.head.appendChild(style);              // gắn vào <head>
  return css;
}
```

Gọi `___$insertStyle(".btn{color:red}")` sẽ thêm `<style>.btn{color:red}</style>` vào `<head>`.

### Vì sao hàm này có mặt

Plugin SASS (với tùy chọn `insert: true`) thêm hàm này vào đầu mỗi file đầu ra. Plugin cũng chạy nhầm cho bước sinh `.d.ts`:

| Loại file | Có `___$insertStyle` không |
|---|---|
| 9 file `.d.ts` | ✅ Có (thừa) |
| 10 file `.js` | ❌ Không |

Hàm này **không bao giờ được gọi**. Đây là phần thừa của quá trình build và có thể bỏ qua.

### Vì sao không gây lỗi

File `.d.ts` chỉ được chứa khai báo, nên một hàm có thân là không hợp lệ. Dự án không bị báo lỗi vì `tsconfig.json` có `"skipLibCheck": true`, khiến TypeScript bỏ qua việc kiểm tra `.d.ts` trong thư viện.

---

## 19. `index.js` chứa gì?

`dist/index.js` là **file gốc (entry point)** của thư viện (`"main": "dist/index.js"`). Nó là **barrel file**: không có logic, chỉ gom các phần lại rồi xuất ra.

```js
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./commons/index.js"),o=require("./components/index.js");exports.default=e,exports.components=o;
```

| Câu | Giải thích |
|---|---|
| `"use strict";` | Bật chế độ nghiêm ngặt của JS |
| `Object.defineProperty(exports,"__esModule",{value:!0})` | `!0` = `true`. Đánh dấu "file này vốn là ES Module", để `import x from` lấy `exports.default` |
| `var e=require("./commons/index.js")` | Nạp nhóm commons |
| `o=require("./components/index.js")` | Nạp nhóm components |
| `exports.default=e` | `import commons from "@vna/lib"` → nhóm commons |
| `exports.components=o` | `import { components } from "@vna/lib"` |

Viết lại bằng ES Module:

```js
import * as commons    from "./commons/index";
import * as components from "./components/index";
export { commons as default, components };
```

### Cây export

```
dist/index.js
├── default    = commons/index.js
│                 ├── useReducer
│                 ├── BaseApi
│                 └── utils
└── components = components/index.js
                  ├── CommonTable
                  ├── Loading
                  └── tables → CommonTable
```

### Cách import trong dự án

| Code | Nhận được |
|---|---|
| `import commons from "@vna/lib"` | `commons.BaseApi`… |
| `import { useReducer } from "@vna/lib/dist/commons"` | Hook `useReducer` |
| `import { convertDateToString } from "@vna/lib/dist/commons/utils"` | Hàm định dạng ngày |
| `import { CommonTable, Loading } from "@vna/lib/dist/components"` | Hai component |

---

## 20. `useReducer.js` chứa gì?

Đây là **custom hook React** do tác giả `@vna/lib` viết. Nó **không phải `React.useReducer`**.

### Điểm đặc biệt

- Reducer được phép **`async`**, nên có thể gọi API bên trong.
- Reducer chỉ cần trả về **phần state thay đổi**, hook tự gộp vào state cũ.
- State còn được lưu bản sao vào `globalThis.reducers.<name>`.
- Có hỗ trợ **event** qua EventEmitter.

### Bản dễ đọc

```js
module.exports = function useReducer({ reducer, name = "reducers", effects, initialState, ...rest }) {
  const store = globalThis;
  const [state, setState] = useState(initialState);

  useMemo(() => { _.set(store, `reducers.${name}`, {}); }, []);

  const update = (result) => {
    if (!result) return;
    const callback = result.func;  delete result.func;
    const next = { ...state, ..._.get(store, `reducers.${name}`, {}), ...result };
    setState(next);
    Object.assign(_.get(store, `reducers.${name}`, {}), next);
    if (_.isFunction(callback)) callback();
  };

  const dispatch = async (action, extraState) => {
    action = typeof action === "string" ? { type: action } : (action || {});
    let result = "";
    if (action.type) {
      result = await reducer({
        state: { ...state, ..._.get(store, `reducers.${name}`, {}), ...(extraState || {}) },
        action, dispatch, ...rest,
      });
    }
    update(result);
  };

  if (!_.isEmpty(rest.event)) {
    const handlers = _.isFunction(reducer) && reducer({ state, action: {}, dispatch, ...rest }, "events");
    for (const evt of Object.keys(handlers || {})) {
      rest.event.removeAllListeners([evt]);
      rest.event.on(evt, (payload) => update(_.isFunction(handlers[evt]) ? handlers[evt](payload) : ""));
    }
  }

  const reset = (newState = {}, alsoSetState = false) => {
    _.set(store, `reducers.${name}`, { ...newState });
    if (alsoSetState) setState({ ...newState });
    if (!_.isEmpty(rest.event) && _.isFunction(reducer)) {
      rest.event.removeAllListeners(Object.keys(reducer({ action: {} }, "events") || {}));
    }
  };

  return [state, dispatch, reset];
};
```

Tham số `effects` được đọc ra nhưng **không được dùng**.

### So sánh với `React.useReducer`

| | `React.useReducer` | `useReducer` của `@vna/lib` |
|---|---|---|
| Reducer | `(state, action) => stateMới`, đồng bộ | `({ state, action, dispatch, ...rest }) => phầnThayĐổi`, có thể async |
| Trả về | Toàn bộ state | Chỉ phần thay đổi |
| `dispatch("abc")` | Không hỗ trợ | Hỗ trợ, thành `{ type: "abc" }` |
| Lưu state | Chỉ trong React | React + `globalThis` |
| Kết quả hook | `[state, dispatch]` | `[state, dispatch, reset]` |

---

## 21. Hiểu `useReducer` từ đầu, kèm ví dụ dễ hiểu

### Bước 1: "state" là gì?

**State là dữ liệu màn hình đang hiển thị.** State đổi thì React vẽ lại màn hình.

```js
{ loading: true, years: [], year: {}, rows: [], confirm: { open: false } }
```

### Bước 2: vì sao cần reducer

Một trang có nhiều thao tác. `useReducer` tách chúng ra hai nơi:

- **Component** chỉ vẽ màn hình và **báo** "người dùng vừa làm X".
- **Reducer** nhận "X" và **quyết định state thay đổi thế nào**.

### Bước 3: hình dung bằng nhà hàng 🍜

| Nhà hàng | Code |
|---|---|
| Khách ngồi ở bàn | Component |
| Món đang có trên bàn | `state` |
| Gọi món "phở" | `dispatch("pho")` |
| Phiếu gọi món | `action = { type: "pho" }` |
| Nhà bếp có thực đơn | Reducer với các `cases` |
| Bếp mang món ra | Reducer trả về phần state mới |
| Khách thấy món mới | React vẽ lại màn hình |

### Bước 4: ví dụ nhỏ nhất (đếm số)

```ts
// counterReducer.ts — nhà bếp
const counterReducer = ({ state, action }) => {
  const cases = {
    tang:   () => ({ count: state.count + 1 }),
    giam:   () => ({ count: state.count - 1 }),
    datLai: () => ({ count: 0 }),
  };
  return cases[action.type] && cases[action.type]();
};
export default counterReducer;
```

```tsx
// Counter.tsx — khách
import { useReducer } from "@vna/lib/dist/commons";
import counterReducer from "./counterReducer";

export default function Counter() {
  const [state, dispatch] = useReducer({
    reducer: counterReducer,
    name: "counterReducer",
    initialState: { count: 0 },
  });

  return (
    <div>
      <p>Số hiện tại: {state.count}</p>
      <button onClick={() => dispatch("tang")}>+</button>
      <button onClick={() => dispatch("giam")}>-</button>
      <button onClick={() => dispatch("datLai")}>Đặt lại</button>
    </div>
  );
}
```

Khi bấm **+**:

1. `dispatch("tang")` chạy.
2. Reducer nhận `{ type: "tang" }`.
3. `cases.tang` trả về `{ count: 1 }`.
4. Hook gộp: `{ count: 0 }` → `{ count: 1 }`.
5. Màn hình hiện "1".

### Bước 5: trang thật `formManager`

**Khi mở trang** (`pages/dashboard/formManager.tsx`):

```tsx
const [state, dispatch] = useReducer({
  reducer: formManagerReducer,
  name: "formManagerReducer",
  initialState,
  orther: { enqueueSnackbar, translate },
});

useEffect(() => {
  dispatch("initial");    // gọi API, lấy năm và biểu mẫu
}, []);
```

**Thao tác trên bảng:**

```tsx
<CommonTable
  event={(type, data) => (ele, ...rest) => {
    dispatch({ type, data, ele, rest });
  }}
/>
```

Ví dụ, gõ vào ô "Tên" ở dòng 3 sẽ dispatch `{ type: "onChange", data: { name: "name", rowIdx: 2 }, ele }`. `cases.onChange` sửa `rows[2].name` rồi trả về `{ rows }`.

**Hộp xác nhận:**

```tsx
<Confirm
  onClose={() => dispatch("closeConfirm")}
  onYes={() => dispatch(`${confirm.type}`)}
/>
```

### Bước 6: thêm tính năng mới

1. **Component:** `<button onClick={() => dispatch("refresh")}>Tải lại</button>`
2. **Reducer:**
   ```ts
   refresh: async () => {
     const res = await Form.get({ where: { yearId: state.year.id } });
     return { rows: res?.data?.items || [] };
   },
   ```
3. **Hiển thị** từ `state` (thường đã có sẵn).

### Ba quy tắc cần nhớ

1. Reducer **chỉ trả về phần thay đổi**.
2. Tên trong `dispatch("abc")` phải **trùng** tên case. Nếu sai tên sẽ không có gì xảy ra và cũng không báo lỗi.
3. Mỗi trang đặt **`name` riêng**.

---

## 22. Tổng hợp các điểm cần lưu ý

| # | Vấn đề | Vị trí | Ảnh hưởng | Gợi ý |
|---|---|---|---|---|
| 1 | Token GitLab registry bị commit | `.npmrc` | Lộ quyền truy cập registry | Thu hồi token, dùng `${NPM_TOKEN}` |
| 2 | Token đăng nhập chỉ đọc một lần | `BaseApi` constructor | Có thể lỗi 401 sau khi đăng nhập nếu chưa tải lại trang | Thêm request interceptor ở `api/Base.ts` |
| 3 | `execute` nuốt lỗi | `BaseApi.execute` | `try/catch` không bắt được lỗi API | Kiểm tra `res.success` |
| 4 | `getGlobal` thiếu `return` | `@vna/lib` utils | Luôn trả `undefined` | Không dùng, hoặc tự viết lại |
| 5 | `useReducer` dùng chung state theo `name` | `@vna/lib` useReducer | Trùng `name` thì ghi đè dữ liệu của nhau | Đặt `name` riêng cho mỗi trang |
| 6 | Reducer async ném lỗi | `useReducer.dispatch` | State không cập nhật, `loading` có thể bị kẹt | `try/catch` trong từng case |
| 7 | Giá trị `env` bị ghi cứng lúc build | `next.config.js` | Đổi `.env` phải build lại | Mỗi môi trường một image |
| 8 | Header tenant có thể bị sửa | Frontend | Không phải lớp bảo mật | Backend phải kiểm tra lại |
| 9 | `View.ts`, `Doet.ts` gọi axios trực tiếp | `api/` | Không qua interceptor, phải tự truyền token | Cân nhắc chuyển sang dùng `execute` |
| 10 | `___$insertStyle` trong `.d.ts` | `@vna/lib` | Không ảnh hưởng (nhờ `skipLibCheck`) | Bỏ qua |

---

## 23. Tài liệu học thêm

### JavaScript cơ bản

- Class, kế thừa: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- Getter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
- Setter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
- Promise: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
- async/await: https://javascript.info/async-await (tiếng Việt: https://vi.javascript.info)
- Promise chaining: https://javascript.info/promise-chaining
- Strict mode: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
- ES Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- CommonJS: https://nodejs.org/api/modules.html

### HTTP và API

- HTTP methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- REST API: https://restfulapi.net

### Axios

- Instance: https://axios-http.com/docs/instance
- Interceptors: https://axios-http.com/docs/interceptors
- Request config: https://axios-http.com/docs/req_config
- Response schema: https://axios-http.com/docs/res_schema
- Xử lý lỗi: https://axios-http.com/docs/handling_errors

### React

- `useReducer` gốc: https://react.dev/reference/react/useReducer
- Custom hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
- `useState`: https://react.dev/reference/react/useState
- `useMemo`: https://react.dev/reference/react/useMemo

### Next.js và môi trường

- Biến môi trường trong Next.js: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
- `env` trong `next.config.js`: https://nextjs.org/docs/pages/api-reference/next-config-js/env

### TypeScript và đóng gói

- Kiểu cơ bản: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- `skipLibCheck`: https://www.typescriptlang.org/tsconfig#skipLibCheck
- package.json `main`: https://docs.npmjs.com/cli/configuring-npm/package-json#main
- rollup-plugin-sass: https://github.com/elycruz/rollup-plugin-sass

### Khác

- EventEmitter: https://nodejs.org/api/events.html
- `document.createElement`: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
