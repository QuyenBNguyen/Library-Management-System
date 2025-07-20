const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", roleMiddleware(["member"]), loanController.createLoan); // tạo yêu cầu mượn sách

router.get("/my", roleMiddleware(["member"]), loanController.getMyLoans); // lấy tất cả loán của một người
router.get(
  "/",
  roleMiddleware(["librarian", "manager"]),
  loanController.getAllLoans
); // lấy tất cả loans for librarian and manager

// router.put("/return", roleMiddleware(["member"]), loanController.returnBook); // trả một hoặc nhiều sách

router.get(
  "/:id",
  roleMiddleware(["librarian", "manager"]),
  loanController.getLoanById
);
router.put(
  "/:id",
  roleMiddleware(["librarian", "manager"]),
  loanController.updateLoanById
);

router.delete(
  "/:id",
  roleMiddleware(["librarian", "manager"]),
  loanController.deleteLoanById
);

module.exports = router;
