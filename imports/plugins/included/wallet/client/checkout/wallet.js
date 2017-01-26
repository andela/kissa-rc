/* eslint-disable no-undef */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import { WalletPayment } from "../../lib/collections/schemas";
import { Cart } from "/lib/collections";
import * as walletApi  from "../../lib/api/walletApi";

import "./wallet.html";

Template.walletPaymentForm.helpers({
  WalletPayment() {
    return WalletPayment;
  }
});

AutoForm.addHooks("wallet-payment-form", {
  onSubmit(doc) {
    const template = this.template;
    const amount = Math.round(Cart.findOne().cartTotal());
    Meteor.call("wallet/checkout", doc.payerName, amount, (err, transaction) => {
      if (err) {
        walletApi.handlePaystackSubmitError(template, err.message);
        walletApi.uiEnd(template, "Complete Order");
      } else {
        const paymentMethod = {
          processor: "Wallet",
          method: "Walet Payment",
          transactionId: Random.id(),
          currency: "NGN",
          amount: transaction.amount,
          status: "created",
          mode: "authorize",
          createdAt: new Date(),
          transactions: []
        };
        Alerts.toast("Transaction successful");
        paymentMethod.transactions.push(transaction);
        Meteor.call("cart/submitPayment", paymentMethod);
        Alerts.toast("transaction completed");
      }
    });
    return false;
  }
});